import {
  buildAtomicNatalFacts,
} from "../natal/atomicNatalFactEngine.js";

import {
  buildNatalFeatureVector,
} from "../natal/natalFeatureVector.js";

import {
  composeNatalImages,
} from "../natal/natalImageComposer.js";

import {
  composeContractNatalImages,
} from "../natal/composition/composeContractNatalImages.js";

import {
  compareNatalCompositionShadow,
} from "../natal/composition/compareNatalCompositionShadow.js";

import {
  buildContractNatalHitList,
} from "../natal/composition/buildContractNatalHitList.js";

import {
  buildNatalMasterSummary,
} from "../natal/natalMasterSummaryEngine.js";

import {
  buildFactDrivenDomainReport,
} from "../domain/domainPortraitEngineV2.js";

/**
 * 原局报告第二版总入口。
 *
 * 数据顺序：
 *
 * 排盘数据
 * → 特征向量
 * → 基础事实和高阶规则
 * → 事实去重与冲突处理
 * → 原局取象
 * → 命理总批
 * → 十二维画像
 */
export function buildNatalImageReport({
  chart,
  baseBaziViewModel,
} = {}) {
  const safeChart =
    chart ?? {};

  const viewModel =
    baseBaziViewModel ?? {};

  /*
   * 第一层：机器特征。
   */
  const featureVector =
    buildNatalFeatureVector({
      chart: safeChart,
      baseBaziViewModel:
        viewModel,
    });

  /*
   * 第二层：
   * 基础事实、高阶规则、去重和冲突。
   */
  const atomicFacts =
    buildAtomicNatalFacts(
      featureVector,
    );

  const contractCompositionShadow =
    composeContractNatalImages({
      facts: atomicFacts.contractFacts,
    });

  /*
   * 第三层：
   * 核心主象、支持象、矛盾象和条件象。
   */
  const composed =
    composeNatalImages({
      featureVector,
      atomicFacts,
    });

  const contractCompositionComparison =
    compareNatalCompositionShadow({
      legacyItems:
        composed.hitList?.all ?? [],
      contractImages:
        contractCompositionShadow.images ??
        [],
    });

  const contractHitListPreview =
    buildContractNatalHitList({
      images:
        contractCompositionShadow.images ??
        [],
      facts:
        atomicFacts.contractFacts ??
        [],
    });

  /*
   * 第四层：
   * 由同一批事实生成命理总批。
   */
  const masterSummary =
    buildNatalMasterSummary({
      featureVector,
      atomicFacts,
      coreImages:
        composed.coreImages,
    });

  /*
   * 第五层：
   * 由同一批事实路由到十二维度。
   */
  const domainResult =
    buildFactDrivenDomainReport({
      featureVector,
      atomicFacts,
    });

  const domainEvidence =
    domainResult.domainEvidence;

  const twelveDomains =
    domainResult.twelveDomains;

  return {
    /*
     * 现有页面兼容字段。
     */
    summary:
      composed.summary,

    imageCards:
      composed.imageCards,

    keySignals:
      composed.keySignals,

    weakSignals:
      composed.weakSignals,

    needVerify:
      composed.needVerify,

    featureVector,
    atomicFacts,
    domainEvidence,
    twelveDomains,

    hitList:
      composed.hitList,

    /*
     * 原局第二版正式字段。
     */
    engineVersion:
      "natal-v2",

    domainEngineVersion:
      "domain-v2",

    resolvedFacts:
      atomicFacts.facts,

    suppressedFacts:
      atomicFacts.suppressedFacts ??
      [],

    coreImages:
      composed.coreImages,

    masterSummary,

    /*
     * 调试数据。
     */
    natalDebug: {
      engineVersion:
        "natal-v2",

      domainEngineVersion:
        "domain-v2",

      featureVector,
      atomicFacts,

      resolvedFacts:
        atomicFacts.facts,

      suppressedFacts:
        atomicFacts.suppressedFacts ??
        [],

      coreImages:
        composed.coreImages,

      masterSummary,

      domainEvidence,
      twelveDomains,

      hitList:
        composed.hitList,

      hitListGroups:
        composed.hitList,

      factEngineDebug:
        atomicFacts.debug ??
        {},

      contractCompositionShadow,

      contractCompositionComparison,

      contractHitListPreview,
    },
  };
}
