import { memoryStore } from "@/db/client";
import { CommandCenter } from "@/features/engineering-runs/command-center";
import { notFound } from "next/navigation";

export default async function EngineeringRunPage({
  params,
}: {
  params: Promise<{ projectId: string; runId: string }>;
}) {
  const { projectId, runId } = await params;

  const run = memoryStore.agentRuns.get(runId);
  if (!run) {
    notFound();
  }

  const events = memoryStore.agentEvents.get(runId) || [];
  const changes = memoryStore.fileChanges.get(runId) || [];
  const tests = memoryStore.testRuns.get(runId) || [];
  const security = memoryStore.securityFindings.get(runId) || [];
  const report = memoryStore.engineeringReports.get(runId);

  const nodes = memoryStore.repositoryNodes.get(projectId) || [];
  const edges = memoryStore.repositoryEdges.get(projectId) || [];

  return (
    <CommandCenter
      initialRun={run}
      initialEvents={events}
      initialChanges={changes}
      initialTests={tests}
      initialSecurity={security}
      initialReport={report}
      architectureData={{ nodes, edges }}
    />
  );
}
