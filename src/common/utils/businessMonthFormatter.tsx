export const businessMonthFormatter = (businessMonth: string): string | undefined => {
    if (!businessMonth) return undefined;
    const date = new Date(businessMonth);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
};
