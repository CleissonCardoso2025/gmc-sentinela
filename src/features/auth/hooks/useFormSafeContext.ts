
import { useFormContext } from "react-hook-form";
import { useCallback } from "react";

export function useFormSafeContext() {
  const context = useFormContext();
  
  const safeRegister = useCallback((name: string, options = {}) => {
    if (!context?.register) {
      console.warn(`useFormSafeContext: register not available for field ${name}`);
      return {};
    }
    return context.register(name, options);
  }, [context]);

  const safeGetFieldState = useCallback((name: string) => {
    if (!context?.getFieldState) {
      console.warn(`useFormSafeContext: getFieldState not available for field ${name}`);
      return { error: undefined, isDirty: false, isTouched: false };
    }
    return context.getFieldState(name, context.formState);
  }, [context]);

  return {
    hasContext: !!context,
    control: context?.control,
    register: safeRegister,
    formState: context?.formState,
    getFieldState: safeGetFieldState,
    watch: context?.watch,
    setValue: context?.setValue,
    trigger: context?.trigger,
    handleSubmit: context?.handleSubmit,
    reset: context?.reset
  };
}
