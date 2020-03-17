import kleur from 'kleur';

type Color = 'black' | 'red' | 'green' | 'yellow' | 'blue' | 'magenta' | 'cyan' | 'white' | 'gray' | 'grey';

export default (verbose: boolean) => (message: string, color: Color = 'gray', bold: boolean = false) => {
  if (verbose) {
    const coloredMessage = kleur[color](message);
    console.log(bold ? kleur.bold(coloredMessage) : coloredMessage);
  }
};
