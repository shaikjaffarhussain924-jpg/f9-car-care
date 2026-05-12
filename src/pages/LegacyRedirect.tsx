import { useParams, Navigate } from "react-router-dom";
import { LEGACY_HTML_REDIRECTS } from "@/lib/legacyRedirects";

const LegacyRedirect = () => {
  const { file } = useParams<{ file: string }>();
  const target = file ? LEGACY_HTML_REDIRECTS[file] : undefined;
  if (target) return <Navigate to={`/${target}`} replace />;
  return <Navigate to="/" replace />;
};

export default LegacyRedirect;
