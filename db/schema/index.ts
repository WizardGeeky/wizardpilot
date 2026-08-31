import { pgTable, text, timestamp, integer, boolean, jsonb, uuid, index } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// 1. Users table
export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  githubId: text("github_id").unique(),
  email: text("email").notNull(),
  name: text("name").notNull(),
  avatarUrl: text("avatar_url"),
  encryptedGithubToken: text("encrypted_github_token"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  index("idx_users_email").on(table.email),
  index("idx_users_github_id").on(table.githubId),
]);

// 2. Projects table
export const projects = pgTable("projects", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  repositoryUrl: text("repository_url").notNull(),
  defaultBranch: text("default_branch").default("main").notNull(),
  language: text("language").default("Unknown").notNull(),
  framework: text("framework"),
  description: text("description"),
  isPublic: boolean("is_public").default(false).notNull(),
  metadata: jsonb("metadata").$type<Record<string, unknown>>().default({}),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  index("idx_projects_user_id").on(table.userId),
  index("idx_projects_repo_url").on(table.repositoryUrl),
]);

// 3. Agent Runs table
export const agentRuns = pgTable("agent_runs", {
  id: uuid("id").defaultRandom().primaryKey(),
  projectId: uuid("project_id").references(() => projects.id, { onDelete: "cascade" }).notNull(),
  branch: text("branch").notNull(),
  requirement: text("requirement").notNull(),
  status: text("status", {
    enum: [
      "QUEUED",
      "ANALYZING_REQUIREMENT",
      "ANALYZING_REPOSITORY",
      "ANALYZING_ARCHITECTURE",
      "IMPLEMENTING",
      "TESTING",
      "DEBUGGING",
      "SECURITY_REVIEW",
      "VERIFYING",
      "COMPLETED",
      "FAILED",
      "CANCELLED",
      "TIMEOUT",
    ],
  }).default("QUEUED").notNull(),
  currentAgent: text("current_agent").default("requirement_analyst").notNull(),
  confidenceScore: integer("confidence_score").default(0),
  retryCount: integer("retry_count").default(0).notNull(),
  startedAt: timestamp("started_at", { withTimezone: true }),
  completedAt: timestamp("completed_at", { withTimezone: true }),
  errorMessage: text("error_message"),
  metadata: jsonb("metadata").$type<{
    requirementAnalysis?: unknown;
    repositoryAnalysis?: unknown;
    architecturePlan?: unknown;
    confidenceBreakdown?: Record<string, number>;
    [key: string]: unknown;
  }>().default({}),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  index("idx_runs_project_id").on(table.projectId),
  index("idx_runs_status").on(table.status),
  index("idx_runs_created_at").on(table.createdAt),
]);

// 4. Agent Tasks table
export const agentTasks = pgTable("agent_tasks", {
  id: uuid("id").defaultRandom().primaryKey(),
  runId: uuid("run_id").references(() => agentRuns.id, { onDelete: "cascade" }).notNull(),
  agentName: text("agent_name").notNull(),
  status: text("status", { enum: ["PENDING", "RUNNING", "COMPLETED", "FAILED", "SKIPPED"] }).default("PENDING").notNull(),
  input: jsonb("input").$type<Record<string, unknown>>().default({}),
  output: jsonb("output").$type<Record<string, unknown>>().default({}),
  error: text("error"),
  startedAt: timestamp("started_at", { withTimezone: true }),
  completedAt: timestamp("completed_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  index("idx_tasks_run_id").on(table.runId),
  index("idx_tasks_agent_name").on(table.agentName),
]);

// 5. Agent Events table (SSE telemetry)
export const agentEvents = pgTable("agent_events", {
  id: uuid("id").defaultRandom().primaryKey(),
  runId: uuid("run_id").references(() => agentRuns.id, { onDelete: "cascade" }).notNull(),
  agentName: text("agent_name").notNull(),
  eventType: text("event_type").notNull(),
  severity: text("severity", { enum: ["info", "warning", "error", "success"] }).default("info").notNull(),
  title: text("title").notNull(),
  message: text("message").notNull(),
  payload: jsonb("payload").$type<Record<string, unknown>>().default({}),
  timestamp: timestamp("timestamp", { withTimezone: true }).defaultNow().notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  index("idx_events_run_id").on(table.runId),
  index("idx_events_timestamp").on(table.timestamp),
]);

// 6. Repository Files table
export const repositoryFiles = pgTable("repository_files", {
  id: uuid("id").defaultRandom().primaryKey(),
  projectId: uuid("project_id").references(() => projects.id, { onDelete: "cascade" }).notNull(),
  path: text("path").notNull(),
  sizeBytes: integer("size_bytes").default(0).notNull(),
  language: text("language"),
  isImportant: boolean("is_important").default(false).notNull(),
  isRedacted: boolean("is_redacted").default(false).notNull(),
  sha: text("sha"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  index("idx_repo_files_project_id").on(table.projectId),
  index("idx_repo_files_path").on(table.path),
]);

// 7. Repository Nodes table (Architecture Graph)
export const repositoryNodes = pgTable("repository_nodes", {
  id: uuid("id").defaultRandom().primaryKey(),
  projectId: uuid("project_id").references(() => projects.id, { onDelete: "cascade" }).notNull(),
  runId: uuid("run_id").references(() => agentRuns.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  nodeType: text("node_type", {
    enum: [
      "controller",
      "service",
      "repository",
      "database",
      "external_api",
      "test",
      "utility",
      "module",
    ],
  }).notNull(),
  filePath: text("file_path"),
  metadata: jsonb("metadata").$type<{
    description?: string;
    layer?: string;
    metrics?: Record<string, unknown>;
    impactScore?: number;
    [key: string]: unknown;
  }>().default({}),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  index("idx_nodes_project_id").on(table.projectId),
  index("idx_nodes_run_id").on(table.runId),
  index("idx_nodes_type").on(table.nodeType),
]);

// 8. Repository Edges table
export const repositoryEdges = pgTable("repository_edges", {
  id: uuid("id").defaultRandom().primaryKey(),
  projectId: uuid("project_id").references(() => projects.id, { onDelete: "cascade" }).notNull(),
  runId: uuid("run_id").references(() => agentRuns.id, { onDelete: "cascade" }),
  sourceNodeId: uuid("source_node_id").references(() => repositoryNodes.id, { onDelete: "cascade" }).notNull(),
  targetNodeId: uuid("target_node_id").references(() => repositoryNodes.id, { onDelete: "cascade" }).notNull(),
  relationType: text("relation_type", {
    enum: ["IMPORTS", "CALLS", "DEPENDS_ON", "READS", "WRITES", "TESTS"],
  }).notNull(),
  metadata: jsonb("metadata").$type<Record<string, unknown>>().default({}),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  index("idx_edges_project_id").on(table.projectId),
  index("idx_edges_source").on(table.sourceNodeId),
  index("idx_edges_target").on(table.targetNodeId),
]);

// 9. File Changes table (Git Diffs)
export const fileChanges = pgTable("file_changes", {
  id: uuid("id").defaultRandom().primaryKey(),
  runId: uuid("run_id").references(() => agentRuns.id, { onDelete: "cascade" }).notNull(),
  filePath: text("file_path").notNull(),
  changeType: text("change_type", { enum: ["CREATE", "MODIFY", "DELETE"] }).notNull(),
  reason: text("reason").notNull(),
  diff: text("diff").notNull(),
  originalContent: text("original_content"),
  newContent: text("new_content"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  index("idx_file_changes_run_id").on(table.runId),
  index("idx_file_changes_path").on(table.filePath),
]);

// 10. Test Runs table
export const testRuns = pgTable("test_runs", {
  id: uuid("id").defaultRandom().primaryKey(),
  runId: uuid("run_id").references(() => agentRuns.id, { onDelete: "cascade" }).notNull(),
  suiteName: text("suite_name").notNull(),
  command: text("command").notNull(),
  status: text("status", { enum: ["PASSED", "FAILED", "SKIPPED"] }).notNull(),
  totalTests: integer("total_tests").default(0).notNull(),
  passedTests: integer("passed_tests").default(0).notNull(),
  failedTests: integer("failed_tests").default(0).notNull(),
  skippedTests: integer("skipped_tests").default(0).notNull(),
  durationMs: integer("duration_ms").default(0).notNull(),
  stdout: text("stdout").default("").notNull(),
  stderr: text("stderr").default("").notNull(),
  attemptNumber: integer("attempt_number").default(1).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  index("idx_test_runs_run_id").on(table.runId),
]);

// 11. Test Results table
export const testResults = pgTable("test_results", {
  id: uuid("id").defaultRandom().primaryKey(),
  testRunId: uuid("test_run_id").references(() => testRuns.id, { onDelete: "cascade" }).notNull(),
  testName: text("test_name").notNull(),
  status: text("status", { enum: ["PASSED", "FAILED", "SKIPPED"] }).notNull(),
  durationMs: integer("duration_ms").default(0).notNull(),
  errorMessage: text("error_message"),
  stackTrace: text("stack_trace"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  index("idx_test_results_run_id").on(table.testRunId),
]);

// 12. Security Findings table
export const securityFindings = pgTable("security_findings", {
  id: uuid("id").defaultRandom().primaryKey(),
  runId: uuid("run_id").references(() => agentRuns.id, { onDelete: "cascade" }).notNull(),
  severity: text("severity", { enum: ["CRITICAL", "HIGH", "MEDIUM", "LOW"] }).notNull(),
  filePath: text("file_path"),
  lineNumber: integer("line_number"),
  title: text("title").notNull(),
  description: text("description").notNull(),
  recommendation: text("recommendation").notNull(),
  cwe: text("cwe"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  index("idx_sec_findings_run_id").on(table.runId),
  index("idx_sec_findings_severity").on(table.severity),
]);

// 13. Engineering Reports table
export const engineeringReports = pgTable("engineering_reports", {
  id: uuid("id").defaultRandom().primaryKey(),
  runId: uuid("run_id").references(() => agentRuns.id, { onDelete: "cascade" }).notNull().unique(),
  projectId: uuid("project_id").references(() => projects.id, { onDelete: "cascade" }).notNull(),
  status: text("status", { enum: ["VERIFIED", "PARTIALLY_VERIFIED", "FAILED"] }).notNull(),
  executiveSummary: text("executive_summary").notNull(),
  confidenceScore: integer("confidence_score").notNull(),
  confidenceBreakdown: jsonb("confidence_breakdown").$type<{
    requirementsScore: number;
    testsScore: number;
    regressionScore: number;
    securityScore: number;
    ambiguityScore: number;
    consistencyScore: number;
    total: number;
  }>().notNull(),
  requirementsSatisfied: jsonb("requirements_satisfied").$type<string[]>().default([]).notNull(),
  unresolvedRequirements: jsonb("unresolved_requirements").$type<string[]>().default([]).notNull(),
  risks: jsonb("risks").$type<Array<{ risk: string; severity: string; mitigation: string }>>().default([]).notNull(),
  testSummary: jsonb("test_summary").$type<{
    totalSuites: number;
    totalTests: number;
    passed: number;
    failed: number;
    durationMs: number;
  }>().notNull(),
  securitySummary: jsonb("security_summary").$type<{
    critical: number;
    high: number;
    medium: number;
    low: number;
  }>().notNull(),
  auditTrail: jsonb("audit_trail").$type<Array<{ agent: string; action: string; timestamp: string }>>().default([]).notNull(),
  fullReportMarkdown: text("full_report_markdown").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  index("idx_reports_run_id").on(table.runId),
  index("idx_reports_project_id").on(table.projectId),
]);

// Drizzle Relations
export const usersRelations = relations(users, ({ many }) => ({
  projects: many(projects),
}));

export const projectsRelations = relations(projects, ({ one, many }) => ({
  user: one(users, { fields: [projects.userId], references: [users.id] }),
  runs: many(agentRuns),
  files: many(repositoryFiles),
  nodes: many(repositoryNodes),
  edges: many(repositoryEdges),
  reports: many(engineeringReports),
}));

export const agentRunsRelations = relations(agentRuns, ({ one, many }) => ({
  project: one(projects, { fields: [agentRuns.projectId], references: [projects.id] }),
  tasks: many(agentTasks),
  events: many(agentEvents),
  fileChanges: many(fileChanges),
  testRuns: many(testRuns),
  securityFindings: many(securityFindings),
  report: one(engineeringReports, { fields: [agentRuns.id], references: [engineeringReports.runId] }),
}));
