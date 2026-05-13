import { format } from "date-fns";

export function formatarData(dataIso:Date) {
  if (!dataIso) return "";
  // parseISO converte a string UTC para um objeto Date local
  return format(dataIso, "dd/MM/yyyy HH:mm:ss.SSS");
}