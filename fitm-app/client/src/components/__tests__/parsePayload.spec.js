import { describe, it, expect } from "vitest";
import parsePayload from "@/utils/parsePayload";
import { parsePayloadData } from "@/mocks/mockData";

describe("parsePayload.js", () => {
  it("should parse object in correct format", () => {
    const person = {
      name: {
        isFullName: true,
        value: "Slavyan",
      },
      age: {
        isAdult: true,
        value: 22,
      },
    };

    // Person object should be parsed to this format =>
    // const person = {
    //  name: "Slavyan",
    //  age: 22
    // }
    const result = parsePayload(person);
    // assertion
    expect(result).toStrictEqual(
      parsePayloadData(person.name.value, person.age.value)
    );
  });
});
