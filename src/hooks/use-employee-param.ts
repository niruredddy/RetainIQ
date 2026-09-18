import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useEmployees } from "./use-employees";

export function useEmployeeParam() {
  const [params, setParams] = useSearchParams();
  const employeeCode = params.get("employee");
  const setEmployee = (code: string | null) => {
    const next = new URLSearchParams(params);
    if (code) next.set("employee", code);
    else next.delete("employee");
    setParams(next, { replace: true });
  };
  const employeePath = (path: string) =>
    employeeCode
      ? `${path}?employee=${encodeURIComponent(employeeCode)}`
      : path;
  return { employeeCode, setEmployee, employeePath };
}

export function useSelectedEmployee() {
  const query = useEmployees();
  const { employeeCode, setEmployee, employeePath } = useEmployeeParam();
  useEffect(() => {
    if (!employeeCode && query.data?.[0])
      setEmployee(query.data[0].employee_code);
  }, [employeeCode, setEmployee, query.data]);
  const employee = employeeCode
    ? query.data?.find((e) => e.employee_code === employeeCode)
    : query.data?.[0];
  return { ...query, employeeCode, setEmployee, employeePath, employee };
}
