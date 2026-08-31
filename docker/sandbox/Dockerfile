# ForgePilot Hardened Isolated Sandbox Image
FROM node:20-bookworm-slim

# Install system dependencies, Git, OpenJDK 21, Maven, Python3
RUN apt-get update && apt-get install -y --no-install-recommends \
    git \
    curl \
    ca-certificates \
    openjdk-17-jdk-headless \
    maven \
    python3 \
    python3-pip \
    && rm -rf /var/lib/apt/lists/*

# Create unprivileged sandbox user
RUN useradd -m -u 1001 -s /bin/bash sandboxuser

# Setup isolated workspace
WORKDIR /workspace
RUN chown -R sandboxuser:sandboxuser /workspace

# Switch to non-root user
USER sandboxuser

# Security limits & environment isolation
ENV NODE_ENV=test \
    CI=true \
    JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64 \
    PATH="/usr/lib/jvm/java-17-openjdk-amd64/bin:${PATH}"

# Entrypoint default to bash
CMD ["/bin/bash"]
