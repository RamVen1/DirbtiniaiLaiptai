import React from 'react';
import { View, type ViewProps } from 'react-native';

import { cn } from '@/lib/utils';

export function NeonCard({
  className,
  overflowHidden = false,
  children,
  ...props
}: ViewProps & {
  className?: string;
  overflowHidden?: boolean;
  children?: React.ReactNode;
}) {
  return (
    <View
      className={cn(
        'bg-card rounded-[2rem] border border-border/20',
        overflowHidden && 'overflow-hidden',
        className,
      )}
      {...props}
    >
      {children}
    </View>
  );
}
