import type { InteractionType } from '../../types/lesson.ts';

export function prefetchToolByInteractionType(interactionType: InteractionType): void {
  switch (interactionType) {
    case 'before-after':
      void import('./BeforeAfterTool.tsx');
      break;
    case 'slider-explore':
      void import('./HSLSliderTool.tsx');
      break;
    case 'contrast-checker':
      void import('./ContrastTool.tsx');
      break;
    case 'temperature-sorter':
      void import('./TemperatureSorterTool.tsx');
      break;
    case 'color-wheel':
      void import('./ColorWheelTool.tsx');
      break;
    case 'additive-sort':
      void import('./AdditiveSortTool.tsx');
      break;
    case 'rgb-mixer':
      void import('./RGBMixerTool.tsx');
      break;
    case 'mismatch-explainer':
      void import('./MismatchExplainerTool.tsx');
      break;
    case 'background-shift':
      void import('./BackgroundShiftTool.tsx');
      break;
    case 'format-reveal':
      void import('./FormatRevealTool.tsx');
      break;
    case 'hex-rgb-editor':
      void import('./HexRgbEditorTool.tsx');
      break;
    case 'hsl-playground':
      void import('./HslPlaygroundTool.tsx');
      break;
    case 'alpha-layer':
      void import('./AlphaLayerTool.tsx');
      break;
    case 'theme-sandbox':
      void import('./ThemeSandboxTool.tsx');
      break;
    case 'token-map':
      void import('./TokenMapTool.tsx');
      break;
    case 'color-space-lab':
      void import('./ColorSpaceLabTool.tsx');
      break;
    case 'eye-diagram':
      void import('./EyeDiagramTool.tsx');
      break;
    case 'vision-cards':
      void import('./VisionCardsTool.tsx');
      break;
    case 'interface-gallery':
      void import('./InterfaceGalleryTool.tsx');
      break;
    case 'color-only-detector':
      void import('./ColorOnlyDetectorTool.tsx');
      break;
    case 'state-workshop':
      void import('./StateWorkshopTool.tsx');
      break;
    case 'inclusive-review':
      void import('./InclusiveReviewTool.tsx');
      break;
    case 'text-contrast-lab':
      void import('./TextContrastLabTool.tsx');
      break;
    case 'component-checker':
      void import('./ComponentCheckerTool.tsx');
      break;
    case 'audit-flow':
      void import('./AuditFlowTool.tsx');
      break;
    case 'pattern-repair':
      void import('./PatternRepairTool.tsx');
      break;
    case 'system-comparison':
      void import('./SystemComparisonTool.tsx');
      break;
    case 'role-builder':
      void import('./RoleBuilderTool.tsx');
      break;
    case 'brand-pressure':
      void import('./BrandPressureTool.tsx');
      break;
    case 'dark-translator':
      void import('./DarkTranslatorTool.tsx');
      break;
    case 'chart-tuner':
      void import('./ChartTunerTool.tsx');
      break;
    case 'system-stress':
      void import('./SystemStressTestTool.tsx');
      break;
    case 'logic-fixer':
      void import('./LogicFixerTool.tsx');
      break;
    default: {
      const _exhaustive: never = interactionType;
      void _exhaustive;
      break;
    }
  }
}
