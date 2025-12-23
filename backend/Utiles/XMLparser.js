import { XMLParser } from "fast-xml-parser";

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: ""
});

export default function parsePeopleXML(xmlData) {
  const json = parser.parse(xmlData);

  const participants =
    json?.OdfBody?.Competition?.Participant || [];

  return Array.isArray(participants)
    ? participants
    : [participants];
}
