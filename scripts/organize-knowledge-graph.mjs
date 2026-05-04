import fs from "node:fs"
import path from "node:path"

const root = process.cwd()
const contentRoot = path.join(root, "content")

const z = {
  knowledgeGraph: "\u77e5\u8bc6\u56fe\u8c31",
  hackerbs: "hackerbs",
  knowledgePosition: "\u77e5\u8bc6\u4f4d\u7f6e",
  system: "\u4f53\u7cfb",
  layer: "\u5c42\u7ea7",
  prereq: "\u524d\u7f6e\u77e5\u8bc6",
  related: "\u5f3a\u5173\u8054",
  source: "\u539f\u59cb\u6765\u6e90",
  rule: "\u5173\u7cfb\u89c4\u5219",
  ruleText:
    "\u53ea\u4fdd\u7559\u5b66\u4e60\u6216\u6392\u969c\u4e0a\u6709\u76f4\u63a5\u4f9d\u8d56\u7684\u8fb9\uff0c\u907f\u514d\u4e3a\u4e86\u53cc\u94fe\u800c\u53cc\u94fe\u3002",
  knowledgeTitle: "HackerBS \u77e5\u8bc6\u5b87\u5b99\u603b\u89c8",
  datacentreTitle: "\u6570\u636e\u4e2d\u5fc3\u4e0e\u57fa\u7840\u8bbe\u65bd",
  datacentreMapTitle: "\u6570\u636e\u4e2d\u5fc3\u77e5\u8bc6\u4f53\u7cfb\u603b\u89c8",
  fundamentalsTitle: "\u57fa\u7840\u77e5\u8bc6\u4e0e\u672f\u8bed",
  engineeringTitle: "\u5de5\u7a0b\u5de5\u5177\u4e0e\u81ea\u52a8\u5316",
  embeddedTitle: "\u5d4c\u5165\u5f0f\u4e0e\u5355\u7247\u673a",
  essaysTitle: "\u968f\u7b14\u4e0e\u601d\u60f3",
  hardwareTitle: "\u670d\u52a1\u5668\u786c\u4ef6\u4f53\u7cfb",
  networkTitle: "\u6570\u636e\u4e2d\u5fc3\u7f51\u7edc\u4f53\u7cfb",
  storageTitle: "\u5b58\u50a8\u4e0e\u6570\u636e\u53ef\u9760\u6027\u4f53\u7cfb",
  osTitle: "\u64cd\u4f5c\u7cfb\u7edf\u4e0e\u5e73\u53f0\u4f53\u7cfb",
  virtualizationTitle: "\u865a\u62df\u5316\u4e0e Proxmox \u4f53\u7cfb",
  containerTitle: "\u5bb9\u5668\u4e0e\u955c\u50cf\u4f53\u7cfb",
  securityTitle: "\u5b89\u5168\u4e0e\u8bbf\u95ee\u63a7\u5236",
  operationsTitle: "\u8fd0\u884c\u7a33\u5b9a\u6027\u4e0e\u6392\u969c",
  toolsTitle: "\u5de5\u7a0b\u5de5\u5177\u94fe",
  automationTitle: "\u81ea\u52a8\u5316\u811a\u672c",
  releaseTitle: "\u8f6f\u4ef6\u5206\u53d1\u4e0e\u5305\u7ba1\u7406",
  intro:
    "\u8fd9\u5f20\u5730\u56fe\u53ea\u4fdd\u7559\u4e3b\u5e72\u8def\u5f84\u548c\u9ad8\u4ef7\u503c\u5173\u8054\u3002\u76ee\u6807\u662f\u8ba9\u65b0\u624b\u5148\u5efa\u7acb\u4f53\u7cfb\uff0c\u518d\u6cbf\u7740\u7ecf\u9a8c\u8282\u70b9\u8fdb\u5165\u6392\u969c\u3001\u81ea\u52a8\u5316\u548c\u5de5\u7a0b\u5224\u65ad\u3002",
  principle:
    "\u94fe\u63a5\u539f\u5219\uff1a\u80fd\u4f5c\u4e3a\u524d\u7f6e\u77e5\u8bc6\u3001\u6392\u969c\u5ef6\u4f38\u6216\u5de5\u7a0b\u590d\u7528\u7684\u624d\u5efa\u7acb\u5173\u7cfb\u3002",
  mainPath: "\u4e3b\u5b66\u4e60\u8def\u5f84",
  domains: "\u6838\u5fc3\u77e5\u8bc6\u57df",
  byProblem: "\u6309\u95ee\u9898\u8fdb\u5165",
  systemEntry: "\u4f53\u7cfb\u5165\u53e3",
  route: "\u5efa\u8bae\u8def\u7ebf",
  learningOrder: "\u5b66\u4e60\u987a\u5e8f",
  diagnosticPath: "\u6392\u969c\u8def\u5f84",
  practicePath: "\u5b9e\u8df5\u8def\u5f84",
  standalone: "\u72ec\u7acb\u8282\u70b9",
  entry: "\u5165\u95e8",
  basic: "\u57fa\u7840",
  practice: "\u5b9e\u8df5",
  troubleshooting: "\u6392\u969c",
  caseStudy: "\u6848\u4f8b",
  tool: "\u5de5\u5177",
  release: "\u53d1\u5e03",
  writing: "\u5199\u4f5c",
  essay: "\u968f\u7b14",
}

const articles = {
  itTerms: "fundamentals/it-terms-glossary.md",
  itBasics: "fundamentals/it-basics-encyclopedia.md",
  unstructured: "fundamentals/unstructured-technical-notes.md",

  debianBasics: "datacentre/os/debian-basics.md",
  debianInstall: "datacentre/os/debian-installation.md",
  ubuntuInstall: "datacentre/os/ubuntu-installation.md",
  aptSources: "datacentre/os/apt-mirror-sources.md",
  linuxTips: "datacentre/os/linux-tips.md",

  motherboardIo: "datacentre/hardware/motherboard-io.md",
  memoryTypes: "datacentre/hardware/memory-types.md",
  storageInterfaces: "datacentre/hardware/storage-interfaces.md",
  sasCables: "datacentre/hardware/sas-cables.md",
  gpuBasics: "datacentre/hardware/gpu-basics.md",
  dellPerc: "datacentre/hardware/dell-perc-battery-low.md",
  dellMemory: "datacentre/hardware/dell-poweredge-correctable-memory-error-logging.md",
  thermalPad: "datacentre/hardware/phase-change-thermal-pad.md",

  dellIo: "datacentre/storage/dell-disk-io-alert-troubleshooting.md",
  smartctl: "datacentre/storage/smartctl-disk-troubleshooting-rma.md",
  lvmResidue: "datacentre/storage/lvm-residue-cleanup.md",
  ssdRecovered: "datacentre/storage/server-ssd-fault-self-recovered.md",

  remoteNetwork: "datacentre/network/remote-networking-nginx-reverse-proxy.md",
  sshSecurity: "datacentre/security/linux-ssh-log-intrusion-hardening.md",
  v2rayConfig: "datacentre/security/debian-v2ray-config-json.md",

  pveUefi: "datacentre/virtualization/proxmox-ve-uefi-efi-disk.md",
  pveImport: "datacentre/virtualization/proxmox-ve-import-sylixos-vmware.md",
  qemuNic: "datacentre/virtualization/qemu-virtual-nic-pitfall.md",
  pveBatch: "datacentre/virtualization/proxmox-ve-batch-operations.md",
  pveCron: "datacentre/virtualization/proxmox-ve-crontab-vm-shutdown-startup.md",

  dockerHub: "datacentre/container/docker-hub-workaround-cn.md",
  armDocker: "datacentre/container/debian-x86-64-arm-docker.md",
  armVsftpd: "datacentre/container/armv8-vsftpd-docker-image.md",
  phytiumFtp: "datacentre/container/phytium-arm-docker-ftp.md",
  nextcloud: "datacentre/container/nextcloud-docker-compose.md",

  crashBmc: "datacentre/operations/abnormal-crash-bmc-troubleshooting.md",
  benchmark: "datacentre/operations/server-stability-benchmark-methods.md",

  pythonGfwlist: "engineering/automation/python-gfwlist-to-clash.md",
  packageDeb: "engineering/release/package-binary-as-deb.md",
  aptGpg: "engineering/release/apt-repository-with-gpg-key.md",
  privateApt: "engineering/release/private-apt-repo-and-debs.md",
  pythonFio: "engineering/tools/python-fio-tool-notes.md",
  cppFio: "engineering/tools/cpp-fio-tool-notes.md",
  vscodeMarkdown: "engineering/tools/vscode-markdown-plugins.md",

  mcs51Notes: "embedded/mcs51-study-notes.md",
  mcs51Led: "embedded/mcs51-led-intro.md",

  ripples: "essays/existence-ripples.md",
}

const relations = {
  itTerms: { system: z.fundamentalsTitle, layer: z.entry },
  itBasics: { system: z.fundamentalsTitle, layer: z.basic, prereq: ["itTerms"] },
  unstructured: {
    system: z.fundamentalsTitle,
    layer: z.writing,
    related: ["linuxTips", "vscodeMarkdown"],
  },

  debianBasics: { system: z.osTitle, layer: z.basic, prereq: ["itBasics"] },
  debianInstall: {
    system: z.osTitle,
    layer: z.practice,
    prereq: ["debianBasics"],
    related: ["aptSources"],
  },
  ubuntuInstall: {
    system: z.osTitle,
    layer: z.practice,
    prereq: ["itBasics"],
    related: ["debianInstall"],
  },
  aptSources: {
    system: z.osTitle,
    layer: z.basic,
    prereq: ["debianBasics"],
  },
  linuxTips: { system: z.osTitle, layer: z.practice, prereq: ["debianBasics"] },

  motherboardIo: { system: z.hardwareTitle, layer: z.basic, prereq: ["itBasics"] },
  memoryTypes: { system: z.hardwareTitle, layer: z.basic, prereq: ["itBasics"] },
  storageInterfaces: { system: z.hardwareTitle, layer: z.basic, prereq: ["itBasics"] },
  sasCables: {
    system: z.hardwareTitle,
    layer: z.basic,
    prereq: ["storageInterfaces"],
  },
  gpuBasics: { system: z.hardwareTitle, layer: z.basic, prereq: ["motherboardIo"] },
  dellPerc: {
    system: z.hardwareTitle,
    layer: z.troubleshooting,
    prereq: ["storageInterfaces"],
    related: ["dellIo"],
  },
  dellMemory: { system: z.hardwareTitle, layer: z.troubleshooting, prereq: ["memoryTypes"] },
  thermalPad: {
    system: z.hardwareTitle,
    layer: z.practice,
    prereq: ["itBasics"],
    related: ["benchmark"],
  },

  dellIo: {
    system: z.storageTitle,
    layer: z.troubleshooting,
    prereq: ["storageInterfaces"],
  },
  smartctl: {
    system: z.storageTitle,
    layer: z.troubleshooting,
    prereq: ["dellIo"],
  },
  lvmResidue: { system: z.storageTitle, layer: z.troubleshooting, prereq: ["linuxTips"] },
  ssdRecovered: {
    system: z.storageTitle,
    layer: z.caseStudy,
    prereq: ["smartctl"],
    related: ["benchmark"],
  },

  remoteNetwork: {
    system: z.networkTitle,
    layer: z.practice,
    prereq: ["linuxTips"],
    related: ["sshSecurity"],
  },
  sshSecurity: { system: z.securityTitle, layer: z.troubleshooting, prereq: ["linuxTips"] },
  v2rayConfig: {
    system: z.securityTitle,
    layer: z.practice,
    prereq: ["debianBasics"],
    related: ["sshSecurity"],
  },

  pveUefi: {
    system: z.virtualizationTitle,
    layer: z.basic,
    prereq: ["debianBasics"],
    related: ["storageInterfaces"],
  },
  pveImport: { system: z.virtualizationTitle, layer: z.practice, prereq: ["pveUefi"] },
  qemuNic: { system: z.virtualizationTitle, layer: z.troubleshooting, prereq: ["pveUefi"] },
  pveBatch: {
    system: z.virtualizationTitle,
    layer: z.tool,
    prereq: ["linuxTips"],
    related: ["pveUefi", "qemuNic"],
  },
  pveCron: { system: z.virtualizationTitle, layer: z.tool, prereq: ["pveBatch"] },

  dockerHub: { system: z.containerTitle, layer: z.basic, prereq: ["aptSources"] },
  armDocker: {
    system: z.containerTitle,
    layer: z.practice,
    prereq: ["debianBasics", "dockerHub"],
  },
  armVsftpd: { system: z.containerTitle, layer: z.practice, prereq: ["armDocker"] },
  phytiumFtp: {
    system: z.containerTitle,
    layer: z.practice,
    prereq: ["dockerHub"],
    related: ["armVsftpd"],
  },
  nextcloud: {
    system: z.containerTitle,
    layer: z.practice,
    prereq: ["dockerHub"],
    related: ["aptSources"],
  },

  crashBmc: {
    system: z.operationsTitle,
    layer: z.troubleshooting,
    prereq: ["linuxTips"],
    related: ["dellMemory"],
  },
  benchmark: {
    system: z.operationsTitle,
    layer: z.practice,
    prereq: ["linuxTips"],
    related: ["dellIo"],
  },

  pythonGfwlist: {
    system: z.automationTitle,
    layer: z.tool,
    prereq: ["linuxTips"],
    related: ["v2rayConfig"],
  },
  packageDeb: { system: z.releaseTitle, layer: z.release, prereq: ["debianBasics"] },
  aptGpg: { system: z.releaseTitle, layer: z.release, prereq: ["aptSources", "packageDeb"] },
  privateApt: {
    system: z.releaseTitle,
    layer: z.release,
    prereq: ["packageDeb"],
    related: ["aptGpg"],
  },
  pythonFio: { system: z.toolsTitle, layer: z.tool, prereq: ["benchmark"] },
  cppFio: {
    system: z.toolsTitle,
    layer: z.tool,
    prereq: ["benchmark"],
    related: ["pythonFio"],
  },
  vscodeMarkdown: { system: z.toolsTitle, layer: z.writing },

  mcs51Notes: { system: z.embeddedTitle, layer: z.basic, prereq: ["itTerms"] },
  mcs51Led: { system: z.embeddedTitle, layer: z.practice, prereq: ["mcs51Notes"] },

  ripples: { system: z.essaysTitle, layer: z.essay },
}

function toAbs(rel) {
  return path.join(contentRoot, rel)
}

function slug(rel) {
  return rel.replace(/\\/g, "/").replace(/\.md$/, "")
}

function read(rel) {
  return fs.readFileSync(toAbs(rel), "utf8").replace(/\r\n/g, "\n")
}

function write(rel, text) {
  fs.writeFileSync(toAbs(rel), text.replace(/\r\n/g, "\n"), "utf8")
}

function parseMarkdown(text) {
  const match = text.match(/^---\n([\s\S]*?)\n---\n?/)
  if (!match) {
    throw new Error(`Missing frontmatter`)
  }

  return {
    frontmatterBlock: match[0],
    frontmatter: match[1],
    body: text.slice(match[0].length),
  }
}

function parseTitle(frontmatter) {
  const match = frontmatter.match(/^title:\s*(.+)\s*$/m)
  if (!match) return ""
  return match[1].trim().replace(/^['"]|['"]$/g, "")
}

function parseOriginPath(frontmatter) {
  const match = frontmatter.match(/^\s*path:\s*(.+)\s*$/m)
  if (!match) return ""
  return match[1].trim().replace(/^['"]|['"]$/g, "")
}

const meta = Object.fromEntries(
  Object.entries(articles).map(([id, rel]) => {
    const parsed = parseMarkdown(read(rel))
    return [
      id,
      {
        rel,
        title: parseTitle(parsed.frontmatter),
        origin: parseOriginPath(parsed.frontmatter),
      },
    ]
  }),
)

function link(id) {
  const item = meta[id]
  if (!item) throw new Error(`Unknown article id: ${id}`)
  const label = item.title.replace(/\[/g, "\u3010").replace(/\]/g, "\u3011").replace(/\|/g, "/")
  return `[[${slug(item.rel)}|${label}]]`
}

function links(ids = []) {
  return ids.map(link).join(" / ")
}

function stripRelationBlock(body) {
  const lines = body.replace(/\r\n/g, "\n").split("\n")
  let i = 0
  while (i < lines.length && lines[i].trim() === "") i += 1
  if (!lines[i]?.startsWith("> [!info]")) {
    return lines.slice(i).join("\n")
  }

  let j = i
  while (j < lines.length) {
    if (lines[j].trim() === "") {
      j += 1
      break
    }

    if (lines[j].startsWith(">")) {
      j += 1
      continue
    }

    break
  }

  while (j < lines.length && lines[j].trim() === "") j += 1
  if (lines[j]?.trim() === "---") {
    j += 1
    while (j < lines.length && lines[j].trim() === "") j += 1
  }

  return lines.slice(j).join("\n")
}

function relationBlock(id) {
  const relation = relations[id]
  const item = meta[id]
  const lines = [
    `> [!info] ${z.knowledgePosition}`,
    `> ${z.system}: ${relation.system}`,
    `> ${z.layer}: ${relation.layer}`,
  ]

  if (relation.prereq?.length) lines.push(`> ${z.prereq}: ${links(relation.prereq)}`)
  if (relation.related?.length) lines.push(`> ${z.related}: ${links(relation.related)}`)
  if (item.origin) lines.push(`> ${z.source}: \`${item.origin}\``)
  lines.push(`> ${z.rule}: ${z.ruleText}`)

  return `${lines.join("\n")}\n\n---\n\n`
}

for (const id of Object.keys(articles)) {
  const item = articles[id]
  const parsed = parseMarkdown(read(item))
  const body = stripRelationBlock(parsed.body)
  const frontmatterBlock = parsed.frontmatterBlock.endsWith("\n\n")
    ? parsed.frontmatterBlock
    : `${parsed.frontmatterBlock}\n`
  write(item, `${frontmatterBlock}${relationBlock(id)}${body.replace(/^\n+/, "")}`)
}

function frontmatter(title, tags = []) {
  const tagLines = tags.length ? ["tags:", ...tags.map((tag) => `  - ${tag}`)] : []
  return ["---", `title: ${title}`, ...tagLines, "---", "", ""].join("\n")
}

function page(title, body, tags = [z.knowledgeGraph]) {
  return `${frontmatter(title, tags)}# ${title}\n\n${body.join("\n")}\n`
}

function ordered(ids) {
  return ids.map((id, index) => `${index + 1}. ${link(id)}`)
}

function bullet(ids) {
  return ids.map((id) => `- ${link(id)}`)
}

function indexLink(slugValue, title) {
  return `[[${slugValue}|${title}]]`
}

write(
  "knowledge-universe-map.md",
  page(
    z.knowledgeTitle,
    [
      z.intro,
      "",
      z.principle,
      "",
      `## ${z.mainPath}`,
      "",
      ...ordered([
        "itTerms",
        "itBasics",
        "debianBasics",
        "linuxTips",
        "storageInterfaces",
        "dellIo",
        "smartctl",
        "pveUefi",
        "pveBatch",
        "benchmark",
      ]),
      "",
      `## ${z.domains}`,
      "",
      `- ${indexLink("datacentre/_index", z.datacentreTitle)}`,
      `- ${indexLink("fundamentals/_index", z.fundamentalsTitle)}`,
      `- ${indexLink("engineering/_index", z.engineeringTitle)}`,
      `- ${indexLink("embedded/_index", z.embeddedTitle)}`,
      `- ${indexLink("essays/_index", z.essaysTitle)}`,
      "",
      `## ${z.byProblem}`,
      "",
      `- Linux / Debian: ${link("debianBasics")}`,
      `- RAID / Disk IO: ${link("dellIo")}`,
      `- SMART / RMA: ${link("smartctl")}`,
      `- Proxmox: ${link("pveBatch")}`,
      `- Docker / ARM: ${link("armDocker")}`,
      `- Automation: ${link("pythonGfwlist")}`,
    ],
    [z.knowledgeGraph, z.hackerbs],
  ),
)

write(
  "datacentre/_index.md",
  page(
    z.datacentreTitle,
    [
      "\u6570\u636e\u4e2d\u5fc3\u662f HackerBS \u7684\u4e3b\u5e72\uff1a\u5148\u7406\u89e3\u7cfb\u7edf\u548c\u786c\u4ef6\uff0c\u518d\u8fdb\u5165\u5b58\u50a8\u3001\u865a\u62df\u5316\u3001\u5bb9\u5668\u548c\u6392\u969c\u3002",
      "",
      `## ${z.systemEntry}`,
      "",
      `- ${indexLink("datacentre/datacenter-knowledge-map", z.datacentreMapTitle)}`,
      `- ${indexLink("datacentre/os/_index", z.osTitle)}`,
      `- ${indexLink("datacentre/hardware/_index", z.hardwareTitle)}`,
      `- ${indexLink("datacentre/storage/_index", z.storageTitle)}`,
      `- ${indexLink("datacentre/virtualization/_index", z.virtualizationTitle)}`,
      `- ${indexLink("datacentre/container/_index", z.containerTitle)}`,
      `- ${indexLink("datacentre/security/_index", z.securityTitle)}`,
      `- ${indexLink("datacentre/operations/_index", z.operationsTitle)}`,
      "",
      `## ${z.route}`,
      "",
      ...ordered([
        "debianBasics",
        "linuxTips",
        "storageInterfaces",
        "dellIo",
        "pveUefi",
        "dockerHub",
        "benchmark",
      ]),
    ],
    ["datacentre", z.knowledgeGraph],
  ),
)

write(
  "datacentre/datacenter-knowledge-map.md",
  page(
    z.datacentreMapTitle,
    [
      "\u8fd9\u662f\u6570\u636e\u4e2d\u5fc3\u4f53\u7cfb\u7684\u7b80\u5316\u7248\u5730\u56fe\uff0c\u4e0d\u628a\u6240\u6709\u6587\u7ae0\u76f8\u4e92\u6253\u901a\uff0c\u53ea\u4fdd\u7559\u80fd\u6307\u5bfc\u5b66\u4e60\u548c\u6392\u969c\u7684\u8def\u7ebf\u3002",
      "",
      `## ${z.mainPath}`,
      "",
      ...ordered([
        "debianBasics",
        "linuxTips",
        "motherboardIo",
        "storageInterfaces",
        "dellIo",
        "smartctl",
        "pveUefi",
        "pveBatch",
      ]),
      "",
      `## ${z.diagnosticPath}`,
      "",
      ...ordered([
        "storageInterfaces",
        "dellPerc",
        "dellIo",
        "smartctl",
        "ssdRecovered",
        "benchmark",
      ]),
      "",
      `## ${z.practicePath}`,
      "",
      ...ordered(["aptSources", "dockerHub", "armDocker", "armVsftpd", "nextcloud"]),
    ],
    ["datacentre", z.knowledgeGraph],
  ),
)

const indexPages = {
  "fundamentals/_index.md": {
    title: z.fundamentalsTitle,
    tags: ["fundamentals", z.knowledgeGraph],
    lines: [
      "\u5148\u628a\u6982\u5ff5\u3001\u672f\u8bed\u548c\u57fa\u7840\u5224\u65ad\u6253\u7262\uff0c\u540e\u9762\u624d\u80fd\u770b\u61c2\u7cfb\u7edf\u3001\u786c\u4ef6\u548c\u6392\u969c\u3002",
      "",
      `## ${z.learningOrder}`,
      "",
      ...ordered(["itTerms", "itBasics", "unstructured"]),
    ],
  },
  "datacentre/os/_index.md": {
    title: z.osTitle,
    tags: ["linux", "debian", z.knowledgeGraph],
    lines: [
      "\u64cd\u4f5c\u7cfb\u7edf\u662f\u670d\u52a1\u5668\u7ecf\u9a8c\u7684\u5e95\u5ea7\uff0c\u5b83\u627f\u63a5\u5305\u7ba1\u7406\u3001\u5b58\u50a8\u3001\u7f51\u7edc\u548c\u81ea\u52a8\u5316\u3002",
      "",
      `## ${z.learningOrder}`,
      "",
      ...ordered(["debianBasics", "debianInstall", "aptSources", "linuxTips", "ubuntuInstall"]),
    ],
  },
  "datacentre/hardware/_index.md": {
    title: z.hardwareTitle,
    tags: ["hardware", z.knowledgeGraph],
    lines: [
      "\u786c\u4ef6\u4f53\u7cfb\u7528\u6765\u5efa\u7acb\u5bf9\u670d\u52a1\u5668\u5185\u90e8\u8fde\u63a5\u3001\u6269\u5c55\u8fb9\u754c\u548c\u6545\u969c\u73b0\u8c61\u7684\u76f4\u89c9\u3002",
      "",
      `## ${z.learningOrder}`,
      "",
      ...ordered(["motherboardIo", "memoryTypes", "storageInterfaces", "sasCables", "gpuBasics"]),
      "",
      `## ${z.diagnosticPath}`,
      "",
      ...bullet(["dellPerc", "dellMemory", "thermalPad"]),
    ],
  },
  "datacentre/storage/_index.md": {
    title: z.storageTitle,
    tags: ["storage", z.knowledgeGraph],
    lines: [
      "\u5b58\u50a8\u4f53\u7cfb\u628a\u63a5\u53e3\u8ba4\u77e5\u3001\u544a\u8b66\u6392\u67e5\u548c\u6570\u636e\u53ef\u9760\u6027\u653e\u5728\u540c\u4e00\u6761\u94fe\u8def\u91cc\u3002",
      "",
      `## ${z.diagnosticPath}`,
      "",
      ...ordered(["storageInterfaces", "dellIo", "smartctl", "ssdRecovered", "lvmResidue"]),
    ],
  },
  "datacentre/network/_index.md": {
    title: z.networkTitle,
    tags: ["network", z.knowledgeGraph],
    lines: [
      "\u7f51\u7edc\u4f53\u7cfb\u76ee\u524d\u4ee5\u5f02\u5730\u7ec4\u7f51\u548c\u53cd\u5411\u4ee3\u7406\u5b9e\u8df5\u4e3a\u6838\u5fc3\uff0c\u540e\u7eed\u53ef\u6269\u5c55\u4ea4\u6362\u3001\u8def\u7531\u548c\u5149\u7ea4\u94fe\u8def\u3002",
      "",
      `## ${z.practicePath}`,
      "",
      ...ordered(["remoteNetwork"]),
    ],
  },
  "datacentre/security/_index.md": {
    title: z.securityTitle,
    tags: ["security", z.knowledgeGraph],
    lines: [
      "\u5b89\u5168\u4f53\u7cfb\u5148\u4ece Linux \u8bbf\u95ee\u63a7\u5236\u5f00\u59cb\uff0c\u518d\u8fdb\u5165\u5177\u4f53\u7f51\u7edc\u914d\u7f6e\u3002",
      "",
      `## ${z.learningOrder}`,
      "",
      ...ordered(["sshSecurity", "v2rayConfig"]),
    ],
  },
  "datacentre/virtualization/_index.md": {
    title: z.virtualizationTitle,
    tags: ["proxmox", "virtualization", z.knowledgeGraph],
    lines: [
      "\u865a\u62df\u5316\u4f53\u7cfb\u4ece UEFI \u78c1\u76d8\u3001\u5bfc\u5165\u548c\u7f51\u5361\u5751\u70b9\u8fdb\u5165\uff0c\u6700\u540e\u6536\u675f\u5230\u6279\u91cf\u8fd0\u7ef4\u3002",
      "",
      `## ${z.learningOrder}`,
      "",
      ...ordered(["pveUefi", "pveImport", "qemuNic", "pveBatch", "pveCron"]),
    ],
  },
  "datacentre/container/_index.md": {
    title: z.containerTitle,
    tags: ["docker", "container", z.knowledgeGraph],
    lines: [
      "\u5bb9\u5668\u4f53\u7cfb\u5148\u89e3\u51b3\u955c\u50cf\u548c\u8de8\u67b6\u6784\u73af\u5883\uff0c\u518d\u843d\u5230 ARM \u5e73\u53f0\u548c\u5177\u4f53\u5e94\u7528\u90e8\u7f72\u3002",
      "",
      `## ${z.practicePath}`,
      "",
      ...ordered(["dockerHub", "armDocker", "armVsftpd", "phytiumFtp", "nextcloud"]),
    ],
  },
  "datacentre/operations/_index.md": {
    title: z.operationsTitle,
    tags: ["operations", z.knowledgeGraph],
    lines: [
      "\u8fd0\u884c\u7a33\u5b9a\u6027\u662f\u628a\u7cfb\u7edf\u7ecf\u9a8c\u3001\u786c\u4ef6\u4fe1\u53f7\u548c\u6d4b\u8bd5\u65b9\u6cd5\u8fde\u8d77\u6765\u7684\u5de5\u7a0b\u5c42\u3002",
      "",
      `## ${z.diagnosticPath}`,
      "",
      ...ordered(["linuxTips", "crashBmc", "benchmark"]),
    ],
  },
  "engineering/_index.md": {
    title: z.engineeringTitle,
    tags: ["engineering", z.knowledgeGraph],
    lines: [
      "\u5de5\u7a0b\u4f53\u7cfb\u628a\u7ecf\u9a8c\u56fa\u5316\u4e3a\u811a\u672c\u3001\u5de5\u5177\u3001\u5305\u548c\u53ef\u590d\u7528\u7684\u6d41\u7a0b\u3002",
      "",
      `## ${z.systemEntry}`,
      "",
      `- ${indexLink("engineering/automation/_index", z.automationTitle)}`,
      `- ${indexLink("engineering/tools/_index", z.toolsTitle)}`,
      `- ${indexLink("engineering/release/_index", z.releaseTitle)}`,
    ],
  },
  "engineering/automation/_index.md": {
    title: z.automationTitle,
    tags: ["automation", z.knowledgeGraph],
    lines: ["", `## ${z.practicePath}`, "", ...ordered(["pythonGfwlist"])],
  },
  "engineering/tools/_index.md": {
    title: z.toolsTitle,
    tags: ["tools", z.knowledgeGraph],
    lines: [
      "",
      `## ${z.practicePath}`,
      "",
      ...ordered(["benchmark", "pythonFio", "cppFio", "vscodeMarkdown"]),
    ],
  },
  "engineering/release/_index.md": {
    title: z.releaseTitle,
    tags: ["release", z.knowledgeGraph],
    lines: ["", `## ${z.learningOrder}`, "", ...ordered(["packageDeb", "aptGpg", "privateApt"])],
  },
  "embedded/_index.md": {
    title: z.embeddedTitle,
    tags: ["embedded", z.knowledgeGraph],
    lines: ["", `## ${z.learningOrder}`, "", ...ordered(["mcs51Notes", "mcs51Led"])],
  },
  "essays/_index.md": {
    title: z.essaysTitle,
    tags: ["essays"],
    lines: ["", `## ${z.standalone}`, "", ...bullet(["ripples"])],
  },
}

for (const [rel, config] of Object.entries(indexPages)) {
  write(rel, page(config.title, config.lines, config.tags))
}

console.log(
  `Organized ${Object.keys(articles).length} article relation blocks and ${Object.keys(indexPages).length + 3} map pages.`,
)
