import { useSearchParams } from "react-router-dom";

/**
 * Shared "selected employee" state carried in the URL as ?employee=<code>,
 * so clicking an employee anywhere navigates to their data and Deep-Dive /
 * Mobility Matcher / Action Center all follow the same selection.
 */
export function useEmployeeParam() {
  const [params, setParams] = useSearchParams();
  const employeeCode = params.get("employee");

  const setEmployee = (code: string | null) => {
    const next = new URLSearchParams(params);
    if (code) {
      next.set("employee", code);
    } else {
      next.delete("employee");
    }
    setParams(next, { replace: true });
  };

  return { employeeCode, setEmployee };
}
