
import { Decimal } from '@prisma/client/runtime/library';

/**
 * Recursively converts non-serializable objects (like Prisma Decimal) 
 * into plain JavaScript types (like numbers).
 */
export function serializeData<T>(data: T): T {
    if (data === null || data === undefined) return data;

    // Handle arrays
    if (Array.isArray(data)) {
        return data.map(item => serializeData(item)) as unknown as T;
    }

    // Handle Prisma Decimal
    if (typeof data === 'object' && data.constructor.name === 'Decimal') {
        return (data as unknown as Decimal).toNumber() as unknown as T;
    }

    // Handle Date objects (optionally convert to string if needed, 
    // but Next.js normally handles Dates in RSC/Client boundary if they are simple)
    // However, for consistency in generic JSON responses, keeping them as is or converting
    if (data instanceof Date) {
        return data as unknown as T;
    }

    // Handle objects
    if (typeof data === 'object' && data !== null) {
        const serialized: Record<string, unknown> = {};
        for (const [key, value] of Object.entries(data)) {
            serialized[key] = serializeData(value);
        }
        return serialized as unknown as T;
    }

    return data;
}

/**
 * Flattens a nested object into a single level object with dot notation keys.
 */
export function flattenObject(obj: any, prefix = ''): Record<string, any> {
    if (obj === null || obj === undefined) return {};

    return Object.keys(obj).reduce((acc: any, k: string) => {
        const pre = prefix.length ? prefix + '.' : '';
        const value = obj[k];

        if (
            typeof value === 'object' &&
            value !== null &&
            !(value instanceof Date) &&
            value.constructor?.name !== 'Decimal'
        ) {
            Object.assign(acc, flattenObject(value, pre + k));
        } else {
            acc[pre + k] = value;
        }
        return acc;
    }, {});
}
