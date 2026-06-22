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
  CONTRACT_DOMAIN_ENGINE_VERSION,
  buildFactDrivenDomainReport,
} from "../domain/domainPortraitEngineV2.js";

import {
  buildNatalAiEvidencePack,
} from "../natal/ai/buildNatalAiEvidencePack.js";

import {
  buildNatalStructureSynopsis,
} from "../natal/structure/buildNatalStructureSynopsis.js";

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

  const structureSynopsis =
    buildNatalStructureSynopsis(
      featureVector,
    );
  /*
   * 第二层：
   * 基础事实、高阶规则、去重和冲突。
   */
  const atomicFacts =
    buildAtomicNatalFacts(
      featureVector,
    );

  const contractComposition =
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
        contractComposition.images ??
        [],
    });

  const contractHitList =
    buildContractNatalHitList({
      images:
        contractComposition.images ??
        [],
      facts:
        atomicFacts.contractFacts ??
        [],
      scope: "natal",
    });

  const fallbackReasons = [];
  const hasValidContractHitList =
    Boolean(contractHitList) &&
    Array.isArray(contractHitList.all);
  const productionHitList =
    hasValidContractHitList
      ? contractHitList
      : composed.hitList;

  if (!hasValidContractHitList) {
    fallbackReasons.push(
      "contract_hit_list_invalid",
    );
  }

  /*
   * 第四层：
   * 由同一批合同事实路由到十二维度。
   */
const legacyDomainResult =
  buildFactDrivenDomainReport({
    featureVector,
    atomicFacts,

    contractFacts:
      atomicFacts.facts ?? [],

    compositionImages: [],

    hitList:
      composed.hitList,

    scope: "natal",
  });

const domainResult =
  buildFactDrivenDomainReport({
    featureVector,
    structureSynopsis,
    atomicFacts,

    contractFacts:
      atomicFacts.contractFacts ?? [],

    compositionImages:
      contractComposition.images ?? [],

    hitList:
      productionHitList,

    scope: "natal",
  });

  const domainEvidence =
    domainResult.domainEvidence;

  const twelveDomains =
    domainResult.twelveDomains;

  /*
   * 第五层：
   * 命理总批只归纳合同组合象与十二领域。
   */
  const legacyMasterSummary =
    buildNatalMasterSummary({
      featureVector,
      atomicFacts,
      coreImages:
        composed.coreImages,
    });

  const masterSummary =
    buildNatalMasterSummary({
      featureVector,
      structureSynopsis,

      facts:
        atomicFacts.contractFacts ?? [],

      compositionImages:
        contractComposition.images ?? [],

      hitList:
        productionHitList,

      twelveDomains,
      scope: "natal",
    });

  const natalAiEvidencePack =
    buildNatalAiEvidencePack({
      chart: safeChart,
      featureVector,
      structureSynopsis,

      contractFacts:
        atomicFacts.contractFacts ?? [],

      compositionImages:
        contractComposition.images ?? [],

      hitList:
        productionHitList,

      twelveDomains,
      masterSummary,
      scope: "natal",
    });

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
    structureSynopsis,
    atomicFacts,
    domainEvidence,
    twelveDomains,

    hitList:
      productionHitList,

    /*
     * 原局第二版正式字段。
     */
    engineVersion:
      "natal-v2",

    domainEngineVersion:
      CONTRACT_DOMAIN_ENGINE_VERSION,

    resolvedFacts:
      atomicFacts.facts,

    suppressedFacts:
      atomicFacts.suppressedFacts ??
      [],

    coreImages:
      composed.coreImages,

    masterSummary,

    natalAiEvidencePack,

    /*
     * 调试数据。
     */
    natalDebug: {
      engineVersion:
        "natal-v2",

      domainEngineVersion:
        CONTRACT_DOMAIN_ENGINE_VERSION,

      featureVector,
      structureSynopsis,
      atomicFacts,

      resolvedFacts:
        atomicFacts.facts,

      suppressedFacts:
        atomicFacts.suppressedFacts ??
        [],

      coreImages:
        composed.coreImages,

      legacyMasterSummary,

      contractMasterSummary:
        masterSummary,

      masterSummary,

      legacyTwelveDomains:
        legacyDomainResult.twelveDomains,

      legacyDomainReport: {
        domainEngineVersion: "domain-v2",
        domainEvidence:
          legacyDomainResult.domainEvidence,
        twelveDomains:
          legacyDomainResult.twelveDomains,
      },

      contractTwelveDomains:
        twelveDomains,

      domainEvidence,
      twelveDomains,

      legacyHitList:
        composed.hitList,

      contractHitList,

      hitList:
        productionHitList,

      hitListGroups:
        productionHitList,

      factEngineDebug:
        atomicFacts.debug ??
        {},

      contractComposition,

      contractCompositionShadow:
        contractComposition,

      contractCompositionComparison,

      contractHitList,

      contractHitListPreview:
        contractHitList,

      natalAiEvidencePack,

      displayedHitListSource:
        hasValidContractHitList
          ? "contract"
          : "legacy",

      displayedDomainSource:
        "contract",

      displayedMasterSummarySource:
        "contract",

      fallbackReasons,
    },
  };
}
