import { useEffect, useState } from "preact/hooks";

export type FxState = {
  loading: boolean;
  error?: string;
  base: string;
  target: string;
  amount: number;
  rate?: number;
  date?: string;
};

export function useFx(base: string, target: string, amount: number) {
  const [state, setState] = useState<FxState>({
    loading: true,
    base,
    target,
    amount
  });

  useEffect(() => {
    let active = true;
    const load = async () => {
      setState((prev) => ({ ...prev, loading: true, error: undefined }));
      try {
        const url = `https://api.frankfurter.dev/v1/latest?base=${base}&symbols=${target}`;
        const resp = await fetch(url);
        if (!resp.ok) throw new Error("汇率数据获取失败");
        const data = await resp.json();
        if (!active) return;
        const rate = data.rates?.[target];
        setState({
          loading: false,
          base,
          target,
          amount,
          rate,
          date: data.date
        });
      } catch (error) {
        if (!active) return;
        setState({
          loading: false,
          base,
          target,
          amount,
          error: error instanceof Error ? error.message : "未知错误"
        });
      }
    };

    load();
    return () => {
      active = false;
    };
  }, [base, target, amount]);

  return state;
}
