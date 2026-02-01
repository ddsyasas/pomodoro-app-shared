import React, { useEffect, useRef, useMemo } from 'react';
import { StyleSheet, Animated, Easing } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import type { SessionType } from '../../types';
import { useTheme } from '../../hooks/useTheme';

interface AnimatedBackgroundProps {
    sessionType: SessionType;
    isBreak: boolean;
    children: React.ReactNode;
}

// Session-based gradient colors for dark mode
const darkGradients: Record<SessionType, [string, string, string]> = {
    focus: ['#1A1A2E', '#16213E', '#0F0F1A'],
    shortBreak: ['#1A2E1A', '#162E21', '#0F1A0F'],
    longBreak: ['#1A1A2E', '#162138', '#0F0F1A'],
};

// Session-based gradient colors for light mode
const lightGradients: Record<SessionType, [string, string, string]> = {
    focus: ['#F5F5F7', '#E8E8EC', '#DCDCE0'],
    shortBreak: ['#E8F5E9', '#C8E6C9', '#A5D6A7'],
    longBreak: ['#E3F2FD', '#BBDEFB', '#90CAF9'],
};

export function AnimatedBackground({
    sessionType,
    isBreak,
    children,
}: AnimatedBackgroundProps) {
    const { isDark } = useTheme();
    const fadeAnim = useRef(new Animated.Value(1)).current;
    const breatheAnim = useRef(new Animated.Value(1)).current;
    const prevSessionRef = useRef<SessionType>(sessionType);

    // Fade transition when session changes
    useEffect(() => {
        if (prevSessionRef.current !== sessionType) {
            Animated.sequence([
                Animated.timing(fadeAnim, {
                    toValue: 0.7,
                    duration: 200,
                    useNativeDriver: true,
                }),
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 400,
                    useNativeDriver: true,
                }),
            ]).start();
            prevSessionRef.current = sessionType;
        }
    }, [sessionType, fadeAnim]);

    // Breathing animation during breaks
    useEffect(() => {
        let animation: Animated.CompositeAnimation | null = null;

        if (isBreak) {
            animation = Animated.loop(
                Animated.sequence([
                    Animated.timing(breatheAnim, {
                        toValue: 1.02,
                        duration: 3000,
                        easing: Easing.inOut(Easing.ease),
                        useNativeDriver: true,
                    }),
                    Animated.timing(breatheAnim, {
                        toValue: 1,
                        duration: 3000,
                        easing: Easing.inOut(Easing.ease),
                        useNativeDriver: true,
                    }),
                ])
            );
            animation.start();
        } else {
            breatheAnim.setValue(1);
        }

        return () => {
            if (animation) {
                animation.stop();
            }
        };
    }, [isBreak, breatheAnim]);

    const gradientColors = isDark ? darkGradients[sessionType] : lightGradients[sessionType];

    return (
        <Animated.View
            style={[
                styles.container,
                {
                    opacity: fadeAnim,
                    transform: [{ scale: breatheAnim }],
                },
            ]}
        >
            <LinearGradient
                colors={gradientColors}
                style={styles.gradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
            />
            {children}
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    gradient: {
        ...StyleSheet.absoluteFillObject,
    },
});
