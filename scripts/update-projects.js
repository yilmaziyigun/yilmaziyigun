import fs from "fs";

const START = "<!--AUTO-PROJECTS:START-->";
const END = "<!--AUTO-PROJECTS:END-->";

async function run() {
  const readme = fs.readFileSync("README.md", "utf8");

  // Güvenlik: işaretler yoksa README'ye dokunma
  if (!readme.includes(START) || !readme.includes(END)) {
    console.log("Auto project markers not found. README not changed.");
    return;
  }

  const res = await fetch(
    "https://api.github.com/users/yilmaziyigun/repos?sort=updated&per_page=6"
  );
  const repos = await res.json();

  const projects = repos
    .filter(r => !r.fork && r.name !== "yilmaziyigun")
    .map(r => {
      const desc = r.description ?? "Açıklama eklenmemiş.";
      return `- **${r.name}**  \n  ${desc}`;
    })
    .join("\n\n");

  const before = readme.split(START)[0];
  const after = readme.split(END)[1];

  const updated =
    `${before}${START}\n\n${projects}\n\n${END}${after}`;

  fs.writeFileSync("README.md", updated);
}

run();
