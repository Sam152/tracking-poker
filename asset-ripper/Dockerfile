FROM public.ecr.aws/lambda/nodejs:20 as builder

# Download the ffmpeg binaries, and move binaries from the release into /usr/ffmpeg/(ffmpeg|ffprobe).
RUN dnf install tar xz -y
WORKDIR /usr/ffmpeg
RUN curl -L https://github.com/yt-dlp/FFmpeg-Builds/releases/download/autobuild-2024-03-31-14-06/ffmpeg-n6.1.1-31-gaa5e6017a5-linux64-gpl-6.1.tar.xz -o ffmpeg.tar.xz
RUN tar -xf ffmpeg.tar.xz
RUN tar -xf ffmpeg.tar.xz && mv ffmpeg*/* .
RUN chmod +x bin/*

# Build and bundle the service.
ADD common /usr/common/
WORKDIR /usr/app
ADD asset-ripper/src src/
COPY asset-ripper/*.ts asset-ripper/*.json ./
RUN npm install
RUN npm run build


FROM public.ecr.aws/lambda/nodejs:20

# Required to make the ssl import work in python, tested with `RUN python -c "import ssl"`.
ENV LD_LIBRARY_PATH=""
RUN dnf install -y python3
RUN pip install yt-dlp==2024.3.10 pycryptodome==3.20.0

# Copy the ffmpeg binary from the builder, into the runtime container to use as
# a dependency.
COPY --from=builder /usr/ffmpeg/bin/* /usr/local/bin/
RUN ls /usr/local/bin/
RUN ffmpeg -version

WORKDIR ${LAMBDA_TASK_ROOT}
COPY --from=builder /usr/app/build/ ./

CMD [ "index.handler" ]
