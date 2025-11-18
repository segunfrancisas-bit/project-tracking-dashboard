// Server component: safe to access params
import CostTrendGraphClient from "./CostTrendGraphClient";

interface Props {
  params: { state: string };
}

export default function CostTrendGraphPage({ params }: Props) {
  const state = params.state || "lagos"; // fallback
  return <CostTrendGraphClient state={state} />;
}
