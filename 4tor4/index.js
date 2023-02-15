const fs = require("fs")
const ffmpeg = require('fluent-ffmpeg');
const pathToFfmpeg = require('ffmpeg-static');
const ffprobe = require('ffprobe-static');
const { getVideoDurationInSeconds } = require('get-video-duration')

// {
//   fileName: "8",
//     start: {
//   min: ,
//   sec:
//     },
//   end: {
//     min: ,
//     sec:
//       }
// }
const files = [
  {
    fileName: "1",
    start: {
      min: 4,
      sec: 26
    },
    end: {
      min: 9,
      sec: 15
    }
  },
  {
    fileName: "1",
    start: {
      min: 9,
      sec: 34
    },
    end: {
      min: 14,
      sec: 49
    }
  },
  {
    fileName: "1",
    start: {
      min: 17,
      sec: 45
    },
    end: {
      min: 25,
      sec: 59
    }
  },
  {
    fileName: "2",
    start: {
      min: 2,
      sec: 52
    },
    end: {
      min: 10,
      sec: 25
    }
  },
  {
    fileName: "2",
    start: {
      min: 10,
      sec: 38
    },
    end: {
      min: 15,
      sec: 10
    }
  },
  {
    fileName: "2",
    start: {
      min: 18,
      sec: 49
    },
    end: {
      min: 24,
      sec: 57
    }
  },
  {
    fileName: "3",
    start: {
      min: 5,
      sec: 2
    },
    end: {
      min: 11,
      sec: 32
    }
  },
  {
    fileName: "3",
    start: {
      min: 12,
      sec: 43
    },
    end: {
      min: 19,
      sec: 36
    }
  },
  {
    fileName: "3",
    start: {
      min: 20,
      sec: 49
    },
    end: {
      min: 28,
      sec: 2
    }
  },
  {
    fileName: "4",
    start: {
      min: 5,
      sec: 1
    },
    end: {
      min: 9,
      sec: 56
    }
  },
  {
    fileName: "4",
    start: {
      min: 12,
      sec: 35
    },
    end: {
      min: 17,
      sec: 23
    }
  },
  {
    fileName: "4",
    start: {
      min: 20,
      sec: 53
    },
    end: {
      min: 28,
      sec: 46
    }
  },
  {
    fileName: "5",
    start: {
      min: 2,
      sec: 59
    },
    end: {
      min: 10,
      sec: 35
    }
  },
  {
    fileName: "5",
    start: {
      min: 13,
      sec: 27
    },
    end: {
      min: 19,
      sec: 17
    }
  },
  {
    fileName: "5",
    start: {
      min: 19,
      sec: 33
    },
    end: {
      min: 25,
      sec: 3
    }
  },
  {
    fileName: "5",
    start: {
      min: 25,
      sec:30
    },
    end: {
      min: 30,
      sec: 57
    }
  },
  {
    fileName: "6",
    start: {
      min: 2,
      sec: 57
    },
    end: {
      min: 10,
      sec: 18
    }
  },
  {
    fileName: "6",
    start: {
      min: 12,
      sec: 51
    },
    end: {
      min: 20,
      sec: 5
    }
  },
  {
    fileName: "6",
    start: {
      min: 22,
      sec: 44
    },
    end: {
      min: 33,
      sec: 5
    }
  },
  {
    fileName: "7",
    start: {
      min: 5,
      sec: 40
    },
    end: {
      min: 13,
      sec: 49
    }
  },
  {
    fileName: "7",
    start: {
      min: 16,
      sec: 32
    },
    end: {
      min: 20,
      sec: 45
    }
  },
  {
    fileName: "7",
    start: {
      min: 21,
      sec: 45
    },
    end: {
      min: 27,
      sec: 55
    }
  },
  {
    fileName: "8",
    start: {
      min: 5,
      sec: 52
    },
    end: {
      min: 12,
      sec: 36
    }
  },
  {
    fileName: "8",
    start: {
      min: 18,
      sec: 29
    },
    end: {
      min: 21,
      sec: 45
    }
  },
  {
    fileName: "8",
    start: {
      min: 23,
      sec: 1
    },
    end: {
      min: 29,
      sec: 1
    }
  },
  {
    fileName: "9",
    start: {
      min: 6,
      sec: 44
    },
    end: {
      min: 13,
      sec: 21
    }
  },
  {
    fileName: "9",
    start: {
      min: 18,
      sec: 28
    },
    end: {
      min: 23,
      sec: 6
    }
  },
  {
    fileName: "9",
    start: {
      min: 23,
      sec: 44
    },
    end: {
      min: 32,
      sec: 25
    }
  },
  {
    fileName: "10",
    start: {
      min: 8,
      sec: 57
    },
    end: {
      min: 18,
      sec: 42
    }
  },
  {
    fileName: "10",
    start: {
      min: 19,
      sec: 34
    },
    end: {
      min: 24,
      sec: 35
    }
  },
  {
    fileName: "10",
    start: {
      min: 25,
      sec: 8
    },
    end: {
      min: 30,
      sec: 15
    }
  },
]

const cutVideo = async (sourcePath, outputPath, startTime, duration) => {
  console.log(`start cut video ${sourcePath} -> ${outputPath}`);

  await new Promise((resolve, reject) => {
    ffmpeg(sourcePath)
      .setFfmpegPath(pathToFfmpeg)
      .setFfprobePath(ffprobe.path)
      .setStartTime(startTime)
      .setDuration(duration)
      .output(outputPath)
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

async function main() {
  let errorCnt = 0
  const srcDir = "./src"
  const outDir = "./output"
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir)
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir)

  for (let i = 0; i < files.length; i++) {
    const file = files[i]
    const srcPath = `${srcDir}/${file.fileName}.mp4`
    const outPath = `${outDir}/${file.fileName}_${file.start.min}-${file.start.sec}_${file.end.min}-${file.end.sec}.mp4`
    const startTime = file.start.min * 60 + file.start.sec
    const endTime = file.end.min * 60 + file.end.sec
    try {
      const vdoLength = await getVideoDurationInSeconds(srcPath)
      await cutVideo(
        srcPath,
        outPath,
        startTime,
        endTime - startTime,
      )
    } catch (e) {
      errorCnt++
      console.log("Error >>> ", JSON.stringify(e))
    }
  }
  console.log(`Total error = ${errorCnt}`)
}

main()