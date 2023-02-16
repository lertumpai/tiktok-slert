const fs = require("fs")
const { shuffle } = require("fast-shuffle")
const ffmpeg = require('fluent-ffmpeg');
const pathToFfmpeg = require('ffmpeg-static');
const ffprobe = require('ffprobe-static');
const { getVideoDurationInSeconds } = require('get-video-duration')
const getMediaDimensions = require('get-media-dimensions')

const cutVideo = async (sourcePath, outputPath, startTime, duration) => {
  console.log(`start cut video ${sourcePath} -> ${outputPath}`);
  const dimension = await getMediaDimensions(sourcePath, "video")

  await new Promise((resolve, reject) => {
    ffmpeg(sourcePath)
      .setFfmpegPath(pathToFfmpeg)
      .setFfprobePath(ffprobe.path)
      .withNoAudio()
      .output(outputPath)
      .setStartTime(startTime)
      .setDuration(duration)
      .videoFilter([{
        filter: "crop",
        options: {
          w: dimension.width,
          h: dimension.height - 140,
        }
      }])
      .on('end', function (err) {
        if (!err) {
          console.log(`finish cut video ${sourcePath} -> ${outputPath}`);
          resolve();
        }
      })
      .on('error', function (err) {
        console.log('error: ', err);
        reject(err);
      })
      .run();
  });
};

function shuffleFile(fileNames, times = 10) {
  const n = 10
  for (let i = 0; i < n; i++) {
    fileNames = shuffle(fileNames)
  }
  return fileNames
}



async function main() {
  let errorCnt = 0
  const srcDir = "./src"
  const outDir = "./output"
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir)
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir)

  const fileNames = shuffleFile(fs.readdirSync(srcDir))
  for (let i = 0; i < fileNames.length; i++) {
    const filename = fileNames[i]
    const srcPath = `${srcDir}/${filename}`
    const outPath = `${outDir}/${i}_${(new Date()).valueOf()}.mp4`
    try {
      const vdoLength = await getVideoDurationInSeconds(srcPath)
      await cutVideo(
        srcPath,
        outPath,
        0,
        vdoLength - 3,
      )
    } catch (e) {
      errorCnt++
      console.log("Error >>> ", JSON.stringify(e))
    }
  }
  console.log(`Total error = ${errorCnt}`)
}

main()