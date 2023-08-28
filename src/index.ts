import { readFile, writeFile } from "fs/promises";
import { MidiEvent, MidiNoteOnEvent, parseMidi } from "midi-file";

const middleA = 69;

const main = async () => {
  const file = await readFile("./overworld.mid");
  const { header, tracks } = parseMidi(file);
  const sparseNoteArray = new Array();
  tracks.forEach((track) => {
    track.forEach((value, index) => {
      const previousDeltaTime = track[index - 1]?.deltaTime ?? 0;
      track[index].deltaTime += previousDeltaTime;
    });
    return track
      .filter((value) => value.type === "noteOn")
      .forEach((value: MidiNoteOnEvent) => {
        let notes = sparseNoteArray[value.deltaTime] ?? [];
        notes = [...notes, value.noteNumber - middleA];
        sparseNoteArray[value.deltaTime] = notes;
      });
  });

  const dootsFuckery = sparseNoteArray
    .map((note) => {
      if (note.length === 1) {
        return note[0].toString();
      }
      return `(${note.join(" ")})`;
    })
    .join(" ")
    .replace(/\s\s+/g, " ");

  await writeFile("./test.txt", dootsFuckery);
};

main();
