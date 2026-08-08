/**
 * Domain section barrel.
 *
 * These are the components that know about calcium carbonate. Primitives know
 * about buttons and tables; these know about grades, mesh sizes, packaging
 * formats and test methods.
 */

export { ApplicationCard } from './ApplicationCard';
export type { ApplicationCardProps } from './ApplicationCard';

export { CertificationStrip } from './CertificationStrip';

export { ContactBlock } from './ContactBlock';
export type { ContactChannel } from './ContactBlock';

export { DocumentDownloadRow } from './DocumentDownloadRow';
export type { DocumentDownloadRowProps } from './DocumentDownloadRow';

export { FaqAccordion } from './FaqAccordion';

export { GradeExplorer, COMPARISON_LIMIT } from './GradeExplorer';
export type { GradeExplorerProps } from './GradeExplorer';

export { GradeMatrix } from './GradeMatrix';
export type { GradeMatrixProps } from './GradeMatrix';

export { Hero } from './Hero';
export type { HeroProps } from './Hero';

export { LogisticsMap } from './LogisticsMap';

export { PackagingOptions } from './PackagingOptions';

export { ParticleSizeChart } from './ParticleSizeChart';
export type { ParticleSizeChartProps } from './ParticleSizeChart';

export { ProcessDiagram } from './ProcessDiagram';

export { ResourceLibrary } from './ResourceLibrary';
export type { ResourceLibraryProps } from './ResourceLibrary';

/*
 * RfqForm is deliberately NOT exported here. It imports the RFQ server action,
 * which calls `headers()`, and re-exporting it through the barrel drags that
 * call into the module graph of every page that imports anything from this
 * file. The visible symptom is the entire route tree switching from static to
 * dynamic. Import it directly from './RfqForm' on the one route that needs it.
 */

export { RfqTeaser } from './RfqTeaser';
export type { RfqTeaserProps } from './RfqTeaser';

export { SpecTable } from './SpecTable';
