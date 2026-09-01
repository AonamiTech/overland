export default function handler(
  _req: unknown,
  res: {
    status(code: number): {
      setHeader(name: string, value: string): {
        send(body: string): void;
      };
      send(body: string): void;
    };
  },
) {
  res.status(410).send('410 Gone');
}
