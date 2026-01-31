import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
} from 'react-native';
import { TaskItem } from './TaskItem';
import { useTaskStore, useActiveTasks, useCompletedTasks } from '../../stores/taskStore';
import { useTheme } from '../../hooks/useTheme';
import { spacing, fontSize, borderRadius } from '../../constants/theme';
import type { TaskFilter } from '../../types';

export const TaskList: React.FC = () => {
    const { colors } = useTheme();
    const filter = useTaskStore((state) => state.filter);
    const setFilter = useTaskStore((state) => state.setFilter);
    const toggleTask = useTaskStore((state) => state.toggleTask);
    const deleteTask = useTaskStore((state) => state.deleteTask);

    const activeTasks = useActiveTasks();
    const completedTasks = useCompletedTasks();

    const tasks = filter === 'active' ? activeTasks : completedTasks;

    const renderTab = (tabFilter: TaskFilter, label: string, count: number) => {
        const isActive = filter === tabFilter;
        return (
            <TouchableOpacity
                style={[
                    styles.tab,
                    { backgroundColor: isActive ? colors.checkboxFilled : 'transparent' },
                ]}
                onPress={() => setFilter(tabFilter)}
                activeOpacity={0.7}
            >
                <Text
                    style={[
                        styles.tabText,
                        { color: isActive ? '#FFFFFF' : colors.textSecondary },
                    ]}
                >
                    {label} ({count})
                </Text>
            </TouchableOpacity>
        );
    };

    const renderEmptyState = () => (
        <View style={styles.emptyContainer}>
            <Text style={[styles.emptyIcon]}>
                {filter === 'active' ? '📝' : '✅'}
            </Text>
            <Text style={[styles.emptyTitle, { color: colors.textPrimary }]}>
                {filter === 'active' ? 'No active tasks' : 'No completed tasks'}
            </Text>
            <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
                {filter === 'active'
                    ? 'Add a task to get started with your Pomodoro session!'
                    : 'Complete some tasks to see them here.'}
            </Text>
        </View>
    );

    return (
        <View style={styles.container}>
            <View style={[styles.tabContainer, { backgroundColor: colors.surfaceLight }]}>
                {renderTab('active', 'Active', activeTasks.length)}
                {renderTab('completed', 'Completed', completedTasks.length)}
            </View>

            <FlatList
                data={tasks}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <TaskItem
                        task={item}
                        onToggle={() => toggleTask(item.id)}
                        onDelete={() => deleteTask(item.id)}
                    />
                )}
                contentContainerStyle={[
                    styles.listContent,
                    tasks.length === 0 && styles.emptyListContent,
                ]}
                ListEmptyComponent={renderEmptyState}
                showsVerticalScrollIndicator={false}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    tabContainer: {
        flexDirection: 'row',
        padding: spacing.xs,
        borderRadius: borderRadius.lg,
        marginBottom: spacing.md,
    },
    tab: {
        flex: 1,
        paddingVertical: spacing.sm,
        paddingHorizontal: spacing.md,
        borderRadius: borderRadius.md,
        alignItems: 'center',
    },
    tabText: {
        fontSize: fontSize.sm,
        fontWeight: '600',
    },
    listContent: {
        paddingBottom: spacing.xl,
    },
    emptyListContent: {
        flex: 1,
        justifyContent: 'center',
    },
    emptyContainer: {
        alignItems: 'center',
        paddingHorizontal: spacing.xl,
    },
    emptyIcon: {
        fontSize: 48,
        marginBottom: spacing.md,
    },
    emptyTitle: {
        fontSize: fontSize.lg,
        fontWeight: '600',
        marginBottom: spacing.sm,
        textAlign: 'center',
    },
    emptySubtitle: {
        fontSize: fontSize.sm,
        textAlign: 'center',
        lineHeight: 20,
    },
});
