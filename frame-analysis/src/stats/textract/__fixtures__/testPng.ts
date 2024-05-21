export const testPng = Buffer.from(
    Uint8Array.from(
        atob(
            "iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAeklEQVQ4jc1SSQ6AIAxkCD/C/7/AP1Uji20tNAYPzokwC3QBnQgLiCvmfwSkdgDQL622jPjYSH7JxR7/TQ+8Sc748gNsQjgyCL56QCHfatr7UdctUM0l4MUmtuZxixjjLOviQ35o+w+sdOt1rREl6PlrWOHJE3hYXqQDX1BL0znGCvEAAAAASUVORK5CYII=",
        ),
        (c) => c.charCodeAt(0),
    ),
);
