const fs = require("fs")
const { shuffle } = require("fast-shuffle")
const ffmpeg = require('fluent-ffmpeg');
const pathToFfmpeg = require('ffmpeg-static')
const ffprobe = require('ffprobe-static')
const getMediaDimensions = require('get-media-dimensions')

const overlayVideo = async (vdo1, vdo2, outputPath) => {
  console.log(`start cut video ${vdo1} -> ${outputPath}`);
  const dimension = await getMediaDimensions(vdo1, "video")

  await new Promise((resolve, reject) => {
    ffmpeg(vdo1)
      .setFfmpegPath(pathToFfmpeg)
      .setFfprobePath(ffprobe.path)
      .input(vdo2)
      .complexFilter([
        `[0:v]scale=${dimension.width}:${dimension.height}[v1]`,
        `[1:v]scale=${dimension.width}:${dimension.height}[v2]`,
        `[v2]chromakey=black[out_remove_background]`,
        `[out_remove_background] trim=start=0:end=${dimension.duration},setpts=PTS-STARTPTS[finalV2]`,
        {
          filter: "overlay",
          options: { x:"0", y:"0" },
          inputs: ["v1", "finalV2"],
          outputs: "output",
        }
      ])
      .outputOptions([
        '-map [output]'
      ])
      .withNoAudio()
      .output(outputPath)
      .on('end', function (err) {
        if (!err) {
          console.log(`finish cut video ${vdo1} -> ${outputPath}`);
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

  // set ตัวแปร overlay ให้เป็นชื่อไฟล์
  const overlay = "/Users/sorawit.ler/Desktop/tiktok-vdo/overlay/overlay.mp4"
  const fileNames = shuffleFile(fs.readdirSync(srcDir))
  for (let i = 0; i < fileNames.length; i++) {
    const filename = fileNames[i]
    const srcPath = `${srcDir}/${filename}`
    const outPath = `${outDir}/${i}_${(new Date()).valueOf()}.mp4`
    try {
      await overlayVideo(
        srcPath,
        overlay,
        outPath
      )
    } catch (e) {
      errorCnt++
      console.log("Error >>> ", JSON.stringify(e))
    }
  }
  console.log(`Total error = ${errorCnt}`)
}

main()