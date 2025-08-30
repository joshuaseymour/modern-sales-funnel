"use client";
import { motion } from "framer-motion";
import { CheckCircle2, Sparkles, Trophy } from "lucide-react";

interface SuccessAnimationProps {
  title?: string;
  message?: string;
  icon?: "check" | "trophy" | "sparkles";
  size?: "sm" | "md" | "lg";
  children?: React.ReactNode;
}

export function SuccessAnimation({ 
  title = "Success!",
  message = "Your order has been completed",
  icon = "check",
  size = "md",
  children 
}: SuccessAnimationProps) {
  const sizes = {
    sm: { icon: 40, container: "h-20 w-20" },
    md: { icon: 60, container: "h-24 w-24" },
    lg: { icon: 80, container: "h-32 w-32" }
  };

  const iconComponents = {
    check: CheckCircle2,
    trophy: Trophy,
    sparkles: Sparkles
  };

  const IconComponent = iconComponents[icon];
  const sizeConfig = sizes[size];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ 
        duration: 0.6, 
        ease: "easeOut",
        type: "spring",
        stiffness: 200,
        damping: 15
      }}
      className="flex flex-col items-center justify-center text-center space-y-4"
    >
      {/* Success Icon with Animation */}
      <div className="relative">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ 
            delay: 0.2, 
            duration: 0.5,
            type: "spring",
            stiffness: 300,
            damping: 20
          }}
          className={`relative ${sizeConfig.container} bg-green-50 rounded-full flex items-center justify-center`}
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ 
              delay: 0.4, 
              duration: 0.3,
              type: "spring"
            }}
          >
            <IconComponent 
              size={sizeConfig.icon} 
              className="text-green-500"
            />
          </motion.div>
        </motion.div>

        {/* Ripple Effect */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0.5 }}
          animate={{ scale: 1.5, opacity: 0 }}
          transition={{ 
            delay: 0.3,
            duration: 1.2,
            ease: "easeOut"
          }}
          className={`absolute inset-0 ${sizeConfig.container} bg-green-200 rounded-full`}
        />
        
        {/* Second Ripple */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0.3 }}
          animate={{ scale: 2, opacity: 0 }}
          transition={{ 
            delay: 0.5,
            duration: 1.5,
            ease: "easeOut"
          }}
          className={`absolute inset-0 ${sizeConfig.container} bg-green-100 rounded-full`}
        />
      </div>

      {/* Success Text */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.4 }}
        className="space-y-2"
      >
        <h2 className="text-2xl font-bold text-green-800">{title}</h2>
        <p className="text-green-600">{message}</p>
      </motion.div>

      {/* Confetti Effect */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.5 }}
        className="absolute inset-0 pointer-events-none overflow-hidden"
      >
        {Array.from({ length: 12 }).map((_, i) => (
          <motion.div
            key={i}
            initial={{
              x: "50%",
              y: "50%",
              scale: 0,
              rotate: 0
            }}
            animate={{
              x: `${Math.random() * 100}%`,
              y: `${Math.random() * 100}%`,
              scale: [0, 1, 0],
              rotate: 360
            }}
            transition={{
              delay: 0.8 + i * 0.1,
              duration: 2,
              ease: "easeOut"
            }}
            className="absolute w-2 h-2 bg-yellow-400 rounded-full"
          />
        ))}
      </motion.div>

      {/* Custom Content */}
      {children && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.4 }}
          className="mt-6"
        >
          {children}
        </motion.div>
      )}
    </motion.div>
  );
}

// Simpler success checkmark for inline use
export function SuccessCheckmark({ size = 24 }: { size?: number }) {
  return (
    <motion.div
      initial={{ scale: 0, rotate: -180 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{ 
        duration: 0.6,
        type: "spring",
        stiffness: 200,
        damping: 15
      }}
    >
      <CheckCircle2 size={size} className="text-green-500" />
    </motion.div>
  );
}

// Loading to success transition
export function LoadingToSuccess({ 
  isLoading, 
  showSuccess,
  children 
}: { 
  isLoading: boolean;
  showSuccess: boolean;
  children?: React.ReactNode;
}) {
  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex items-center justify-center"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 border-2 border-gray-300 border-t-blue-600 rounded-full"
        />
      </motion.div>
    );
  }

  if (showSuccess) {
    return <SuccessCheckmark />;
  }

  return <>{children}</>;
}