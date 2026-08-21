import { describe, it, expect, afterEach } from 'vitest';
import { render, cleanup } from '@testing-library/react';
import type { ComponentType } from 'react';
import { AdditiveSortTool } from './AdditiveSortTool.tsx';
import { AlphaLayerTool } from './AlphaLayerTool.tsx';
import { AuditFlowTool } from './AuditFlowTool.tsx';
import { BackgroundShiftTool } from './BackgroundShiftTool.tsx';
import { BeforeAfterTool } from './BeforeAfterTool.tsx';
import { BrandPressureTool } from './BrandPressureTool.tsx';
import { ChartTunerTool } from './ChartTunerTool.tsx';
import { ColorOnlyDetectorTool } from './ColorOnlyDetectorTool.tsx';
import { ColorSpaceLabTool } from './ColorSpaceLabTool.tsx';
import { ColorWheelTool } from './ColorWheelTool.tsx';
import { ComponentCheckerTool } from './ComponentCheckerTool.tsx';
import { ContrastTool } from './ContrastTool.tsx';
import { DarkTranslatorTool } from './DarkTranslatorTool.tsx';
import { EyeDiagramTool } from './EyeDiagramTool.tsx';
import { FormatRevealTool } from './FormatRevealTool.tsx';
import { HSLSliderTool } from './HSLSliderTool.tsx';
import { HexRgbEditorTool } from './HexRgbEditorTool.tsx';
import { HslPlaygroundTool } from './HslPlaygroundTool.tsx';
import { InclusiveReviewTool } from './InclusiveReviewTool.tsx';
import { InterfaceGalleryTool } from './InterfaceGalleryTool.tsx';
import { LogicFixerTool } from './LogicFixerTool.tsx';
import { MismatchExplainerTool } from './MismatchExplainerTool.tsx';
import { PatternRepairTool } from './PatternRepairTool.tsx';
import { RGBMixerTool } from './RGBMixerTool.tsx';
import { RoleBuilderTool } from './RoleBuilderTool.tsx';
import { StateWorkshopTool } from './StateWorkshopTool.tsx';
import { SystemComparisonTool } from './SystemComparisonTool.tsx';
import { SystemStressTestTool } from './SystemStressTestTool.tsx';
import { TemperatureSorterTool } from './TemperatureSorterTool.tsx';
import { TextContrastLabTool } from './TextContrastLabTool.tsx';
import { ThemeSandboxTool } from './ThemeSandboxTool.tsx';
import { TokenMapTool } from './TokenMapTool.tsx';
import { VisionCardsTool } from './VisionCardsTool.tsx';

type SmokeTestTool = ComponentType<{ interactive?: boolean; onComplete?: () => void }>;

const TOOLS: [string, SmokeTestTool][] = [
  ['AdditiveSortTool', AdditiveSortTool as SmokeTestTool],
  ['AlphaLayerTool', AlphaLayerTool as SmokeTestTool],
  ['AuditFlowTool', AuditFlowTool as SmokeTestTool],
  ['BackgroundShiftTool', BackgroundShiftTool as SmokeTestTool],
  ['BeforeAfterTool', BeforeAfterTool as SmokeTestTool],
  ['BrandPressureTool', BrandPressureTool as SmokeTestTool],
  ['ChartTunerTool', ChartTunerTool as SmokeTestTool],
  ['ColorOnlyDetectorTool', ColorOnlyDetectorTool as SmokeTestTool],
  ['ColorSpaceLabTool', ColorSpaceLabTool as SmokeTestTool],
  ['ColorWheelTool', ColorWheelTool as SmokeTestTool],
  ['ComponentCheckerTool', ComponentCheckerTool as SmokeTestTool],
  ['ContrastTool', ContrastTool as SmokeTestTool],
  ['DarkTranslatorTool', DarkTranslatorTool as SmokeTestTool],
  ['EyeDiagramTool', EyeDiagramTool as SmokeTestTool],
  ['FormatRevealTool', FormatRevealTool as SmokeTestTool],
  ['HSLSliderTool', HSLSliderTool as SmokeTestTool],
  ['HexRgbEditorTool', HexRgbEditorTool as SmokeTestTool],
  ['HslPlaygroundTool', HslPlaygroundTool as SmokeTestTool],
  ['InclusiveReviewTool', InclusiveReviewTool as SmokeTestTool],
  ['InterfaceGalleryTool', InterfaceGalleryTool as SmokeTestTool],
  ['LogicFixerTool', LogicFixerTool as SmokeTestTool],
  ['MismatchExplainerTool', MismatchExplainerTool as SmokeTestTool],
  ['PatternRepairTool', PatternRepairTool as SmokeTestTool],
  ['RGBMixerTool', RGBMixerTool as SmokeTestTool],
  ['RoleBuilderTool', RoleBuilderTool as SmokeTestTool],
  ['StateWorkshopTool', StateWorkshopTool as SmokeTestTool],
  ['SystemComparisonTool', SystemComparisonTool as SmokeTestTool],
  ['SystemStressTestTool', SystemStressTestTool as SmokeTestTool],
  ['TemperatureSorterTool', TemperatureSorterTool as SmokeTestTool],
  ['TextContrastLabTool', TextContrastLabTool as SmokeTestTool],
  ['ThemeSandboxTool', ThemeSandboxTool as SmokeTestTool],
  ['TokenMapTool', TokenMapTool as SmokeTestTool],
  ['VisionCardsTool', VisionCardsTool as SmokeTestTool],
];

afterEach(() => cleanup());

describe.each(TOOLS)('%s', (_name, Tool) => {
  it('renders in non-interactive mode without crashing', () => {
    render(<Tool interactive={false} />);
    expect(document.body.firstChild).toBeTruthy();
  });
});

// Preview prop variants with significantly different render paths
describe('preview prop variants', () => {
  it('HSLSliderTool renders with previewDimension', () => {
    render(<HSLSliderTool interactive={false} previewDimension="h" />);
    expect(document.body.firstChild).toBeTruthy();
  });

  it('RGBMixerTool renders with previewMode', () => {
    render(<RGBMixerTool interactive={false} previewMode="extremes" />);
    expect(document.body.firstChild).toBeTruthy();
  });

  it('BeforeAfterTool renders hierarchy variant', () => {
    render(<BeforeAfterTool interactive={false} variant="hierarchy" />);
    expect(document.body.firstChild).toBeTruthy();
  });
});
