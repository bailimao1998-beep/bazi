# 原局特殊状态特征 V1：手动接入说明

本包只增加结构化特征，不生成空亡、墓库、十二长生的吉凶结论。

## 1. 新文件

把压缩包中的以下文件复制到仓库对应路径：

- `js/core/natal/config/specialStateTables.js`
- `js/core/natal/featureBuilders/buildVoidFeatures.js`
- `js/core/natal/featureBuilders/buildStorageFeatures.js`
- `js/core/natal/featureBuilders/buildGrowthStageFeatures.js`
- `tests/voidFeatures.test.js`
- `tests/storageFeatures.test.js`
- `tests/growthStageFeatures.test.js`

## 2. 修改 natalFeatureVector.js

### 增加导入

```js
import { buildVoidFeatures } from "./featureBuilders/buildVoidFeatures.js";
import { buildStorageFeatures } from "./featureBuilders/buildStorageFeatures.js";
import { buildGrowthStageFeatures } from "./featureBuilders/buildGrowthStageFeatures.js";
```

### 在 buildPillars() 返回对象中增加

```js
nayin: detail.nayin ?? "",
twelveGrowth: detail.twelveGrowth ?? "",
voidBranches: Array.isArray(detail.voidBranches)
  ? [...detail.voidBranches]
  : [],
```

### 将 dayMaster 从 legacyFields 中提前为独立变量

在 `buildNatalFeatureVector()` 前半段加入：

```js
const dayMaster = {
  stem: safeChart.dayMaster?.stem ?? safeChart.pillars?.day?.stem ?? "",
  label: safeChart.dayMaster?.label ?? safeChart.pillars?.day?.stem ?? "",
  element: elementLabels[safeChart.dayMaster?.element] ?? safeChart.dayMaster?.element ?? "",
  strengthLevel: structure.strength?.level ?? "",
  strengthScore: Number(structure.strength?.score ?? 0),
  inSeason: Boolean(structure.monthCommand?.isDayMasterInSeason),
  rootLevel: structure.roots?.dayMasterRootLevel ?? "",
};
```

然后把 `legacyFields.dayMaster` 改成：

```js
dayMaster,
```

### 在 kinshipFeatures 后构建三个新特征

```js
const voidFeatures = buildVoidFeatures({
  pillars,
});

const storageFeatures = buildStorageFeatures({
  pillars,
  relationMatrix,
  dayMaster,
});

const growthStageFeatures = buildGrowthStageFeatures({
  dayMaster,
  pillars,
});
```

### 在 normalizeNatalFeatureVector() 输入中增加

```js
voidFeatures,
storageFeatures,
growthStageFeatures,
```

## 3. 修改 natalFeatureContract.js

### emptyPillar() 增加

```js
nayin: "",
twelveGrowth: "",
voidBranches: [],
```

### createEmptyNatalFeatureVector() 顶层增加

```js
voidFeatures: emptyVoidFeatures(),
storageFeatures: emptyStorageFeatures(),
growthStageFeatures: emptyGrowthStageFeatures(),
```

### 增加空结构函数

```js
function emptyVoidFeatures() {
  return {
    convention: "xunkong-reference-v1",
    primaryReference: "day",
    references: {
      day: {},
      year: {},
    },
    voidBranches: [],
    byPillar: {},
    voidPillars: [],
    nonVoidPillars: [],
    voidTenGods: {
      mainQi: [],
      hidden: [],
      all: [],
    },
    spousePalace: {
      pillar: "day",
      branch: "",
      byDayReference: false,
      byYearReference: false,
      primaryIsVoid: false,
      evidence: [],
      warnings: [],
    },
    warnings: [],
  };
}

function emptyStorageFeatures() {
  return {
    convention: "four-storage-branches-v1",
    byPillar: {},
    storagePillars: [],
    count: 0,
    branchesPresent: [],
    elementsPresent: [],
    byElement: {},
    openingSignalPillars: [],
    warnings: [],
  };
}

function emptyGrowthStageFeatures() {
  return {
    convention: "day-master-twelve-growth-v1",
    referenceStem: "",
    stages: [],
    byPillar: {},
    byStage: {},
    stageCounts: {},
    knownPillars: [],
    unknownPillars: [],
    monthCommandStage: {},
    spousePalaceStage: {},
    warnings: [],
  };
}
```

### validateNatalFeatureVector() 增加检查

```js
for (const key of [
  "voidFeatures",
  "storageFeatures",
  "growthStageFeatures",
]) {
  if (!isPlainObject(vector[key])) {
    errors.push(`missing feature group ${key}`);
  }
}
```

## 4. 修改 natalFeatureIntegration.test.js

增加：

```js
assert.ok(featureVector.voidFeatures);
assert.ok(featureVector.storageFeatures);
assert.ok(featureVector.growthStageFeatures);
assert.equal(typeof featureVector.voidFeatures.byPillar, "object");
assert.equal(typeof featureVector.storageFeatures.byPillar, "object");
assert.equal(typeof featureVector.growthStageFeatures.byPillar, "object");
assert.equal(featureVector.growthStageFeatures.referenceStem, featureVector.dayMaster.stem);
```

## 5. 运行

```bash
node --check js/core/natal/config/specialStateTables.js
node --check js/core/natal/featureBuilders/buildVoidFeatures.js
node --check js/core/natal/featureBuilders/buildStorageFeatures.js
node --check js/core/natal/featureBuilders/buildGrowthStageFeatures.js
node --check js/core/natal/natalFeatureVector.js
node --check js/core/natal/natalFeatureContract.js
npm test
```
