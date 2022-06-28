import { Request, Response } from "express";
import { PollyClient, SynthesizeSpeechCommand } from "@aws-sdk/client-polly";
import { stream2buffer } from "../utils/buffer.utils";
import { sentenceData } from "../utils/constants";

export const getAudio = async (req: Request, res: Response) => {
  try {
    const client = new PollyClient({ region: "ap-south-1" });
    const command = new SynthesizeSpeechCommand({
      Text: "Hi! How are you? How can I help you?",
      VoiceId: "Joanna",
      OutputFormat: "mp3",
    });
    const audio = await client.send(command);
    res.writeHead(200, { "Content-Type": "audio/mpeg" });
    (audio.AudioStream! as any).pipe(res);
  } catch (err) {
    res.status(500).json(err);
  }
};

export const getSpeechMarks = async (req: Request, res: Response) => {
  try {
    const client = new PollyClient({ region: "ap-south-1" });
    const command = new SynthesizeSpeechCommand({
      Text: "Hi! How are you? How can I help you?",
      VoiceId: "Joanna",
      OutputFormat: "json",
      SpeechMarkTypes: ["word", "viseme"],
    });
    const resp = await client.send(command);
    const buffer = await stream2buffer(resp.AudioStream!);
    let marks = buffer.toString("utf8");
    marks = "[" + marks + "]";
    marks = marks.replace(new RegExp("}\n{", "g"), "},{");
    const marksJson = JSON.parse(marks);
    var frames = [];
    var words = [];
    var counter = 0;
    var wordCounter = 0;
    for (var i = 0; i < marksJson.length; i++) {
      var tmp: any = {};
      if (marksJson[i].type == "word") {
        words.push(marksJson[i].value.toLowerCase());
        wordCounter++;
      }
      if (marksJson[i].type == "word" && !frames[counter]) {
        tmp.time = marksJson[i].time;
        tmp.start = marksJson[i].time;
        tmp.end = 0;
        frames.push(tmp);
      } else if (
        marksJson[i].type == "viseme" &&
        marksJson[i].value == "sil" &&
        frames.length
      ) {
        frames[counter].end = marksJson[i].time;
        counter++;
      }
    }
    res.status(200).json({ frames: frames, words: words });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};

export const postChatMessages = (req: Request, res: Response) => {
  if (!req.body || !req.body.questionText)
    res.status(400).json({ message: "Invalid Request!" });
  const message = req.body.questionText;
  // Here add some logic for chatbot system to generate data from requested question
  const index = Math.floor(Math.random() * (sentenceData.length - 1));
  res.status(200).json({
    message: sentenceData[index],
  });
};
