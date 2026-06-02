export const palaceNames = ["命宫", "兄弟", "夫妻", "子女", "财帛", "疾厄", "迁移", "交友", "官禄", "田宅", "福德", "父母"];

export function buildZiweiPalaces({ birthMonth = 1 } = {}) {
  return palaceNames.map((name, index) => ({
    name,
    index: index + 1,
    theme: defaultTheme(name),
    activated: ((index + Number(birthMonth)) % 4) === 0,
  }));
}

function defaultTheme(name) {
  return {
    命宫: "自我主线",
    夫妻: "关系互动",
    财帛: "资源经营",
    官禄: "事业角色",
    迁移: "外部变化",
  }[name] ?? "辅助观察";
}
