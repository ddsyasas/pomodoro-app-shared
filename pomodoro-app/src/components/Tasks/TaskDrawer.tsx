import React, { useRef, useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Animated,
    TouchableOpacity,
    TouchableWithoutFeedback,
    Dimensions,
} from 'react-native';
import { TaskList } from './TaskList';
import { AddTaskModal } from './AddTaskModal';
import { useTheme } from '../../hooks/useTheme';
import { spacing, fontSize, borderRadius } from '../../constants/theme';

const SCREEN_WIDTH = Dimensions.get('window').width;
const DRAWER_WIDTH = SCREEN_WIDTH * 0.85;

interface TaskDrawerProps {
    visible: boolean;
    onClose: () => void;
}

export const TaskDrawer: React.FC<TaskDrawerProps> = ({ visible, onClose }) => {
    const { colors } = useTheme();
    const [showAddModal, setShowAddModal] = useState(false);
    const [isRendered, setIsRendered] = useState(false);

    const slideAnim = useRef(new Animated.Value(DRAWER_WIDTH)).current;
    const fadeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (visible) {
            setIsRendered(true);
            Animated.parallel([
                Animated.timing(slideAnim, {
                    toValue: 0,
                    duration: 300,
                    useNativeDriver: true,
                }),
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: true,
                }),
            ]).start();
        } else {
            Animated.parallel([
                Animated.timing(slideAnim, {
                    toValue: DRAWER_WIDTH,
                    duration: 250,
                    useNativeDriver: true,
                }),
                Animated.timing(fadeAnim, {
                    toValue: 0,
                    duration: 250,
                    useNativeDriver: true,
                }),
            ]).start(() => {
                setIsRendered(false);
            });
        }
    }, [visible, slideAnim, fadeAnim]);

    if (!visible && !isRendered) {
        return null;
    }

    return (
        <View style={StyleSheet.absoluteFill} pointerEvents={visible ? 'auto' : 'none'}>
            {/* Backdrop */}
            <TouchableWithoutFeedback onPress={onClose}>
                <Animated.View
                    style={[
                        styles.backdrop,
                        { opacity: fadeAnim },
                    ]}
                />
            </TouchableWithoutFeedback>

            {/* Drawer Panel */}
            <Animated.View
                style={[
                    styles.drawer,
                    {
                        backgroundColor: colors.background,
                        transform: [{ translateX: slideAnim }],
                    },
                ]}
            >
                {/* Header */}
                <View style={[styles.header, { borderBottomColor: colors.border }]}>
                    <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                        <Text style={[styles.closeIcon, { color: colors.textSecondary }]}>←</Text>
                    </TouchableOpacity>
                    <Text style={[styles.title, { color: colors.textPrimary }]}>My Tasks</Text>
                    <TouchableOpacity
                        style={[styles.addButton, { backgroundColor: colors.checkboxFilled }]}
                        onPress={() => setShowAddModal(true)}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.addButtonText}>+ Add</Text>
                    </TouchableOpacity>
                </View>

                {/* Task List */}
                <View style={styles.content}>
                    <TaskList />
                </View>
            </Animated.View>

            {/* Add Task Modal */}
            <AddTaskModal
                visible={showAddModal}
                onClose={() => setShowAddModal(false)}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    backdrop: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    drawer: {
        position: 'absolute',
        top: 0,
        right: 0,
        bottom: 0,
        width: DRAWER_WIDTH,
        shadowColor: '#000',
        shadowOffset: { width: -2, height: 0 },
        shadowOpacity: 0.25,
        shadowRadius: 10,
        elevation: 10,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.lg,
        paddingTop: 60, // Account for status bar
        borderBottomWidth: 1,
    },
    closeButton: {
        padding: spacing.sm,
    },
    closeIcon: {
        fontSize: 24,
        fontWeight: '600',
    },
    title: {
        fontSize: fontSize.xl,
        fontWeight: '700',
        flex: 1,
        textAlign: 'center',
    },
    addButton: {
        paddingVertical: spacing.sm,
        paddingHorizontal: spacing.md,
        borderRadius: borderRadius.md,
    },
    addButtonText: {
        color: '#FFFFFF',
        fontSize: fontSize.sm,
        fontWeight: '600',
    },
    content: {
        flex: 1,
        padding: spacing.md,
    },
});
