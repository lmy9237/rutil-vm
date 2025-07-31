################################################################################
# STAGE 1: The Builder
# - Installs all build tools (gcc, etc.).
# - Compiles the script.
# - This entire stage will be discarded at the end.
################################################################################
FROM rockylinux:8 AS builder

# 2. Install Dependencies
# Use dnf/yum to install the C compiler toolchain.
# The '@Development Tools' group includes gcc, make, etc.
# RUN dnf install -y '@Development Tools' \
RUN dnf install -y \
    gcc \
    gcc-c++ \
    # Clean up dnf cache to keep the image layer small
    && dnf clean all

# 3. Set up the working directory
WORKDIR /app

# 4. Copy your project files into the image
# This copies everything from your local project folder (the build context)
# into the /app directory inside the image.
COPY . .

# ldd 버전확인용
RUN touch /app/version.txt
RUN cat /etc/os-release >> /app/version.txt
RUN echo -e "\n" >> /app/version.txt
RUN ldd --version >> /app/version.txt
RUN echo -e "\n" >> /app/version.txt

# 5. Make scripts executable
# Ensure that both your runner script and the shc tool itself have execute permissions.
RUN chmod +x /app/run.sh /app/shc-3.8.9b/shc
# 6. run.sh EOL 처리: DOS (CRLF) -> UNIX (LF)
RUN sed -i -e 's/\r$//' /app/run.sh
RUN sed -i -e 's/\r$//' /app/rutilvm-engine-setup.sh
RUN sed -i -e 's/\r$//' /app/rutilvm-engine-patch.sh
RUN sed -i -e 's/\r$//' /app/rutilvm-host-patch.sh
RUN sed -i -e 's/\r$//' /app/test.sh
# 7. Run the compilation process
# This executes your 'run.sh' script, which in turn calls shc.
# The compiled files (rutilvm-*.sh.x and rutilvm-*.sh.x.c) will be generated inside the image.
RUN /app/run.sh

################################################################################
# STAGE 2: The Final Image
# - Starts from a fresh, clean base image.
# - Contains NO build tools or source code.
# - Only copies the compiled binary from the builder stage.
################################################################################
FROM busybox:musl

# Copy the statically compiled binary from the 'builder' stage
# directly into the root of the filesystem.
RUN mkdir -p /out/sh
COPY --from=builder /app/version.txt /out/version.txt
COPY --from=builder /app/rutilvm-engine-setup.sh.x /out/sh/rutilvm-engine-setup.sh
COPY --from=builder /app/rutilvm-engine-patch.sh.x /out/sh/rutilvm-engine-patch.sh
COPY --from=builder /app/rutilvm-host-patch.sh.x /out/sh/rutilvm-host-patch.sh
COPY --from=builder /app/test.sh.x /out/sh/test.sh

# Set the entrypoint to execute our program.
CMD ["/bash"]
