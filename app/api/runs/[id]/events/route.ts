import { NextRequest } from "next/server";
import { runService } from "../../../../../server/services/run-service";

export const dynamic = "force-dynamic";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const encoder = new TextEncoder();

  let isClosed = false;
  let intervalId: NodeJS.Timeout | null = null;
  let lastEventIndex = 0;

  const stream = new ReadableStream({
    async start(controller) {
      // Send initial connection handshake event
      controller.enqueue(
        encoder.encode(`event: connected\ndata: ${JSON.stringify({ runId: id, connectedAt: new Date() })}\n\n`)
      );

      // Poll and stream new events
      const sendUpdates = async () => {
        if (isClosed) return;
        try {
          const events = await runService.getRunEvents(id);
          const run = await runService.getRunById(id);

          if (events.length > lastEventIndex) {
            const newEvents = events.slice(lastEventIndex);
            for (const ev of newEvents) {
              controller.enqueue(
                encoder.encode(`event: agent_event\ndata: ${JSON.stringify(ev)}\n\n`)
              );
            }
            lastEventIndex = events.length;
          }

          // Send run status heartbeat
          controller.enqueue(
            encoder.encode(
              `event: status_update\ndata: ${JSON.stringify({
                status: run.status,
                currentAgent: run.currentAgent,
                confidenceScore: run.confidenceScore,
              })}\n\n`
            )
          );

          if (run.status === "COMPLETED" || run.status === "FAILED" || run.status === "CANCELLED") {
            // Send final completion ping
            controller.enqueue(
              encoder.encode(`event: run_finished\ndata: ${JSON.stringify({ status: run.status })}\n\n`)
            );
          }
        } catch {
          // Graceful handling during stream lifecycle
        }
      };

      await sendUpdates();
      intervalId = setInterval(sendUpdates, 1500);

      req.signal.addEventListener("abort", () => {
        isClosed = true;
        if (intervalId) clearInterval(intervalId);
        try {
          controller.close();
        } catch {}
      });
    },
    cancel() {
      isClosed = true;
      if (intervalId) clearInterval(intervalId);
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}
