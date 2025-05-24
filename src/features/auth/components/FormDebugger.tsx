
import React from "react";
import { useFormContext } from "react-hook-form";

interface FormDebuggerProps {
  componentName: string;
}

export const FormDebugger: React.FC<FormDebuggerProps> = ({ componentName }) => {
  try {
    const formContext = useFormContext();
    console.log(`${componentName} - Form context available:`, !!formContext);
    
    if (formContext) {
      console.log(`${componentName} - Form methods:`, {
        control: !!formContext.control,
        formState: !!formContext.formState,
        watch: !!formContext.watch,
        setValue: !!formContext.setValue,
        trigger: !!formContext.trigger
      });
    }
    
    return null;
  } catch (error) {
    console.error(`${componentName} - Form context error:`, error);
    return null;
  }
};
