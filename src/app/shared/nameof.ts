/**
 * Allows compile-time checking of names of properties.
 * @param key the property name of the object
 * @param instance an instance of the object
 */
export function nameof<T>(key: keyof T, instance?: T): keyof T {
    return key;
}
