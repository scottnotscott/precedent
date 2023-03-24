async function loadAbilities() {
    const jsonDirectory = path.join(process.cwd(), 'json');
    const fileContents = await fs.readFile(jsonDirectory + '/abilities.json', 'utf8');
    const abilities = JSON.parse(fileContents);
    return abilities;
  }