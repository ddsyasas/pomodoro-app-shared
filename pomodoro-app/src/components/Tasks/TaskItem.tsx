import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Animated,
} from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { spacing, fontSize, borderRadius } from '../../constants/theme';
import type { Task, TaskCategory } from '../../types';

interface TaskItemProps {
    task: Task;
    onToggle: () => void;
    onDelete: () => void;
}

// Category label mapping
const categoryLabels: Record<TaskCategory, string> = {
    work: 'Work',
    personal: 'Personal',
    study: 'Study',
    other: 'Other',
};

// Check if date is overdue
const isOverdue = (dueDate: string | null): boolean => {
    if (!dueDate) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const due = new Date(dueDate);
    due.setHours(0, 0, 0, 0);
    return due < today;
};

// Format date for display
const formatDueDate = (dueDate: string | null): string => {
    if (!dueDate) return '';
    const date = new Date(dueDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const dueDay = new Date(dueDate);
    dueDay.setHours(0, 0, 0, 0);

    if (dueDay.getTime() === today.getTime()) return 'Today';
    if (dueDay.getTime() === tomorrow.getTime()) return 'Tomorrow';

    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

export const TaskItem: React.FC<TaskItemProps> = ({ task, onToggle, onDelete }) => {
    const { colors } = useTheme();

    // Get category color based on category
    const getCategoryColor = (category: TaskCategory): string => {
        switch (category) {
            case 'work': return colors.categoryWork;
            case 'personal': return colors.categoryPersonal;
            case 'study': return colors.categoryStudy;
            case 'other': return colors.categoryOther;
        }
    };

    const overdue = !task.completed && isOverdue(task.dueDate);
    const dueDateText = formatDueDate(task.dueDate);

    return (
        <View style={[styles.container, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <TouchableOpacity
                style={[
                    styles.checkbox,
                    { borderColor: task.completed ? colors.checkboxFilled : colors.checkboxBorder },
                    task.completed && { backgroundColor: colors.checkboxFilled },
                ]}
                onPress={onToggle}
                activeOpacity={0.7}
            >
                {task.completed && (
                    <Text style={styles.checkmark}>✓</Text>
                )}
            </TouchableOpacity>

            <View style={styles.content}>
                <Text
                    style={[
                        styles.title,
                        { color: task.completed ? colors.textMuted : colors.textPrimary },
                        task.completed && styles.completedTitle,
                    ]}
                    numberOfLines={2}
                >
                    {task.title}
                </Text>

                <View style={styles.metaRow}>
                    <View style={[styles.categoryBadge, { backgroundColor: getCategoryColor(task.category) + '20' }]}>
                        <Text style={[styles.categoryText, { color: getCategoryColor(task.category) }]}>
                            {categoryLabels[task.category]}
                        </Text>
                    </View>

                    {dueDateText && (
                        <Text
                            style={[
                                styles.dueDate,
                                { color: overdue ? colors.taskOverdue : colors.textSecondary },
                            ]}
                        >
                            📅 {dueDateText}
                        </Text>
                    )}
                </View>
            </View>

            {task.completed && (
                <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={onDelete}
                    activeOpacity={0.7}
                >
                    <Text style={[styles.deleteIcon, { color: colors.taskOverdue }]}>✕</Text>
                </TouchableOpacity>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: spacing.md,
        borderRadius: borderRadius.lg,
        borderWidth: 1,
        marginBottom: spacing.sm,
    },
    checkbox: {
        width: 24,
        height: 24,
        borderRadius: borderRadius.full,
        borderWidth: 2,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: spacing.md,
    },
    checkmark: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: 'bold',
    },
    content: {
        flex: 1,
    },
    title: {
        fontSize: fontSize.md,
        fontWeight: '500',
        marginBottom: spacing.xs,
    },
    completedTitle: {
        textDecorationLine: 'line-through',
    },
    metaRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.sm,
    },
    categoryBadge: {
        paddingHorizontal: spacing.sm,
        paddingVertical: 2,
        borderRadius: borderRadius.sm,
    },
    categoryText: {
        fontSize: fontSize.xs,
        fontWeight: '600',
    },
    dueDate: {
        fontSize: fontSize.xs,
    },
    deleteButton: {
        padding: spacing.sm,
        marginLeft: spacing.sm,
    },
    deleteIcon: {
        fontSize: fontSize.lg,
        fontWeight: 'bold',
    },
});
