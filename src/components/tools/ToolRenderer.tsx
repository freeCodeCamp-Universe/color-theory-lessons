import { lazy, Suspense } from 'react';
import type { ReactNode } from 'react';
import type { LessonConfig } from '../../types/lesson.ts';
import type { ExerciseStageChangeHandler } from './exercise-stage.ts';
import shellStyles from './ToolShell.module.css';

const BeforeAfterTool = lazy(() => import('./BeforeAfterTool.tsx').then((m) => ({ default: m.BeforeAfterTool })));
const HSLSliderTool = lazy(() => import('./HSLSliderTool.tsx').then((m) => ({ default: m.HSLSliderTool })));
const ContrastTool = lazy(() => import('./ContrastTool.tsx').then((m) => ({ default: m.ContrastTool })));
const TemperatureSorterTool = lazy(() => import('./TemperatureSorterTool.tsx').then((m) => ({ default: m.TemperatureSorterTool })));
const ColorWheelTool = lazy(() => import('./ColorWheelTool.tsx').then((m) => ({ default: m.ColorWheelTool })));
const AdditiveSortTool = lazy(() => import('./AdditiveSortTool.tsx').then((m) => ({ default: m.AdditiveSortTool })));
const RGBMixerTool = lazy(() => import('./RGBMixerTool.tsx').then((m) => ({ default: m.RGBMixerTool })));
const MismatchExplainerTool = lazy(() => import('./MismatchExplainerTool.tsx').then((m) => ({ default: m.MismatchExplainerTool })));
const BackgroundShiftTool = lazy(() => import('./BackgroundShiftTool.tsx').then((m) => ({ default: m.BackgroundShiftTool })));
const FormatRevealTool = lazy(() => import('./FormatRevealTool.tsx').then((m) => ({ default: m.FormatRevealTool })));
const HexRgbEditorTool = lazy(() => import('./HexRgbEditorTool.tsx').then((m) => ({ default: m.HexRgbEditorTool })));
const HslPlaygroundTool = lazy(() => import('./HslPlaygroundTool.tsx').then((m) => ({ default: m.HslPlaygroundTool })));
const AlphaLayerTool = lazy(() => import('./AlphaLayerTool.tsx').then((m) => ({ default: m.AlphaLayerTool })));
const ThemeSandboxTool = lazy(() => import('./ThemeSandboxTool.tsx').then((m) => ({ default: m.ThemeSandboxTool })));
const TokenMapTool = lazy(() => import('./TokenMapTool.tsx').then((m) => ({ default: m.TokenMapTool })));
const ColorSpaceLabTool = lazy(() => import('./ColorSpaceLabTool.tsx').then((m) => ({ default: m.ColorSpaceLabTool })));
const EyeDiagramTool = lazy(() => import('./EyeDiagramTool.tsx').then((m) => ({ default: m.EyeDiagramTool })));
const VisionCardsTool = lazy(() => import('./VisionCardsTool.tsx').then((m) => ({ default: m.VisionCardsTool })));
const InterfaceGalleryTool = lazy(() => import('./InterfaceGalleryTool.tsx').then((m) => ({ default: m.InterfaceGalleryTool })));
const ColorOnlyDetectorTool = lazy(() => import('./ColorOnlyDetectorTool.tsx').then((m) => ({ default: m.ColorOnlyDetectorTool })));
const StateWorkshopTool = lazy(() => import('./StateWorkshopTool.tsx').then((m) => ({ default: m.StateWorkshopTool })));
const InclusiveReviewTool = lazy(() => import('./InclusiveReviewTool.tsx').then((m) => ({ default: m.InclusiveReviewTool })));
const TextContrastLabTool = lazy(() => import('./TextContrastLabTool.tsx').then((m) => ({ default: m.TextContrastLabTool })));
const ComponentCheckerTool = lazy(() => import('./ComponentCheckerTool.tsx').then((m) => ({ default: m.ComponentCheckerTool })));
const AuditFlowTool = lazy(() => import('./AuditFlowTool.tsx').then((m) => ({ default: m.AuditFlowTool })));
const PatternRepairTool = lazy(() => import('./PatternRepairTool.tsx').then((m) => ({ default: m.PatternRepairTool })));
const SystemComparisonTool = lazy(() => import('./SystemComparisonTool.tsx').then((m) => ({ default: m.SystemComparisonTool })));
const RoleBuilderTool = lazy(() => import('./RoleBuilderTool.tsx').then((m) => ({ default: m.RoleBuilderTool })));
const BrandPressureTool = lazy(() => import('./BrandPressureTool.tsx').then((m) => ({ default: m.BrandPressureTool })));
const DarkTranslatorTool = lazy(() => import('./DarkTranslatorTool.tsx').then((m) => ({ default: m.DarkTranslatorTool })));
const ChartTunerTool = lazy(() => import('./ChartTunerTool.tsx').then((m) => ({ default: m.ChartTunerTool })));
const SystemStressTestTool = lazy(() => import('./SystemStressTestTool.tsx').then((m) => ({ default: m.SystemStressTestTool })));
const LogicFixerTool = lazy(() => import('./LogicFixerTool.tsx').then((m) => ({ default: m.LogicFixerTool })));

/** Props for the ToolRenderer component. */
interface ToolRendererProps {
  /** The full configuration of the lesson using this tool. */
  lesson: LessonConfig;
  /** Callback triggered when the tool's challenge condition is met. */
  onChallengeComplete: () => void;
  /** Reports the stable identifier and data for the tool's active stage. */
  onStageChange?: ExerciseStageChangeHandler;
}

/**
 * A dynamic factory component that renders the correct interactive tool
 * based on the lesson's interactionType.
 *
 * It acts as the bridge between the generic LessonPlayer and the
 * specific logic of 30+ different tools.
 */
export function ToolRenderer({ lesson, onChallengeComplete, onStageChange }: ToolRendererProps) {
  let tool: ReactNode;

  switch (lesson.interactionType) {
    case 'before-after':
      tool = (
        <BeforeAfterTool
          variant={lesson.id === 'u1-l5' ? 'hierarchy' : 'color-function'}
          interactive={true}
          onComplete={onChallengeComplete}
        />
      );
      break;

    case 'slider-explore':
      tool = (
        <HSLSliderTool
          interactive={true}
          onComplete={onChallengeComplete}
          onStageChange={onStageChange}
        />
      );
      break;

    case 'contrast-checker':
      tool = <ContrastTool interactive={true} onComplete={onChallengeComplete} />;
      break;

    case 'temperature-sorter':
      tool = (
        <TemperatureSorterTool
          interactive={true}
          onComplete={onChallengeComplete}
          onStageChange={onStageChange}
        />
      );
      break;

    case 'color-wheel':
      tool = <ColorWheelTool interactive={true} onComplete={onChallengeComplete} />;
      break;

    case 'additive-sort':
      tool = <AdditiveSortTool interactive={true} onComplete={onChallengeComplete} />;
      break;

    case 'rgb-mixer':
      tool = <RGBMixerTool interactive={true} onComplete={onChallengeComplete} />;
      break;

    case 'mismatch-explainer':
      tool = <MismatchExplainerTool interactive={true} onComplete={onChallengeComplete} />;
      break;

    case 'background-shift':
      tool = <BackgroundShiftTool interactive={true} onComplete={onChallengeComplete} />;
      break;

    case 'format-reveal':
      tool = <FormatRevealTool interactive={true} onComplete={onChallengeComplete} />;
      break;

    case 'hex-rgb-editor':
      tool = <HexRgbEditorTool interactive={true} onComplete={onChallengeComplete} />;
      break;

    case 'hsl-playground':
      tool = <HslPlaygroundTool interactive={true} onComplete={onChallengeComplete} />;
      break;

    case 'alpha-layer':
      tool = <AlphaLayerTool interactive={true} onComplete={onChallengeComplete} />;
      break;

    case 'theme-sandbox':
      tool = <ThemeSandboxTool interactive={true} onComplete={onChallengeComplete} />;
      break;

    case 'token-map':
      tool = <TokenMapTool interactive={true} onComplete={onChallengeComplete} />;
      break;

    case 'color-space-lab':
      tool = (
        <ColorSpaceLabTool
          interactive={true}
          onComplete={onChallengeComplete}
          onStageChange={onStageChange}
        />
      );
      break;

    case 'eye-diagram':
      tool = (
        <EyeDiagramTool
          interactive={true}
          onComplete={onChallengeComplete}
          onStageChange={onStageChange}
        />
      );
      break;

    case 'vision-cards':
      tool = (
        <VisionCardsTool
          interactive={true}
          onComplete={onChallengeComplete}
          onStageChange={onStageChange}
        />
      );
      break;

    case 'interface-gallery':
      tool = (
        <InterfaceGalleryTool
          interactive={true}
          onComplete={onChallengeComplete}
          onStageChange={onStageChange}
        />
      );
      break;

    case 'color-only-detector':
      tool = (
        <ColorOnlyDetectorTool
          interactive={true}
          onComplete={onChallengeComplete}
          onStageChange={onStageChange}
        />
      );
      break;

    case 'state-workshop':
      tool = <StateWorkshopTool interactive={true} onComplete={onChallengeComplete} />;
      break;

    case 'inclusive-review':
      tool = <InclusiveReviewTool interactive={true} onComplete={onChallengeComplete} />;
      break;

    case 'text-contrast-lab':
      tool = <TextContrastLabTool interactive={true} onComplete={onChallengeComplete} />;
      break;

    case 'component-checker':
      tool = <ComponentCheckerTool interactive={true} onComplete={onChallengeComplete} />;
      break;

    case 'audit-flow':
      tool = (
        <AuditFlowTool
          interactive={true}
          onComplete={onChallengeComplete}
          onStageChange={onStageChange}
        />
      );
      break;

    case 'pattern-repair':
      tool = <PatternRepairTool interactive={true} onComplete={onChallengeComplete} />;
      break;

    case 'system-comparison':
      tool = <SystemComparisonTool interactive={true} onComplete={onChallengeComplete} onStageChange={onStageChange} />;
      break;

    case 'role-builder':
      tool = <RoleBuilderTool interactive={true} onComplete={onChallengeComplete} onStageChange={onStageChange} />;
      break;

    case 'brand-pressure':
      tool = <BrandPressureTool interactive={true} onComplete={onChallengeComplete} onStageChange={onStageChange} />;
      break;

    case 'dark-translator':
      tool = <DarkTranslatorTool interactive={true} onComplete={onChallengeComplete} onStageChange={onStageChange} />;
      break;

    case 'chart-tuner':
      tool = <ChartTunerTool interactive={true} onComplete={onChallengeComplete} onStageChange={onStageChange} />;
      break;

    case 'system-stress':
      tool = <SystemStressTestTool interactive={true} onComplete={onChallengeComplete} onStageChange={onStageChange} />;
      break;

    case 'logic-fixer':
      tool = <LogicFixerTool interactive={true} onComplete={onChallengeComplete} />;
      break;

    default: {
      const _exhaustive: never = lesson.interactionType;
      tool = null;
      void _exhaustive;
      break;
    }
  }

  return (
    <Suspense
      fallback={
        <div className={shellStyles.shell}>
          <span className={shellStyles.toolLabel}>interactive tool</span>
          <p style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>loading tool...</p>
        </div>
      }
    >
      {tool}
    </Suspense>
  );
}
