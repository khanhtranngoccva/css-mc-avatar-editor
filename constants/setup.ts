import {z} from "zod";

export const BOX_NAMES = z.enum(["head", "torso", "leftArm", "rightArm", "leftLeg", "rightLeg", "headOuter", "torsoOuter", "leftArmOuter", "rightArmOuter", "leftLegOuter", "rightLegOuter"]);
export type BoxName = z.infer<typeof BOX_NAMES>;
export const AVATAR_EDITOR_MODES = z.enum(["paint", "view", "erase"]);
export type AvatarEditorMode = z.infer<typeof AVATAR_EDITOR_MODES>

export const AVATAR_EDITOR_TOGGLES = z.enum(["walk"]);
export type AvatarEditorToggle = z.infer<typeof AVATAR_EDITOR_TOGGLES>

export interface SetupProperties {
    width: number,
    height: number,
    length: number,
    x: number,
    y: number,
    z: number,
    baseUnit: string,
    wrapSize: string,
    swingDelayMultiplier?: number,
    canSwing?: boolean,
    swingCenterY?: number,
}

export const SETUP_INFO: Record<BoxName, SetupProperties> = {
    head: {width: 8, height: 8, length: 8, x: 0, y: -10, z: 0, baseUnit: "20px", wrapSize: "0px"},
    torso: {width: 4, height: 12, length: 8, x: 0, y: 0, z: 0, baseUnit: "20px", wrapSize: "0px"},
    leftArm: {width: 4, height: 12, length: 4, x: 6, y: 0, z: 0, baseUnit: "20px", wrapSize: "0px", swingCenterY: -6, canSwing: true, swingDelayMultiplier: 0},
    rightArm: {width: 4, height: 12, length: 4, x: -6, y: 0, z: 0, baseUnit: "20px", wrapSize: "0px", swingCenterY: -6, canSwing: true, swingDelayMultiplier: -0.5},
    leftLeg: {width: 4, height: 12, length: 4, x: 2, y: 12, z: 0, baseUnit: "20px", wrapSize: "0px", swingCenterY: -6, canSwing: true, swingDelayMultiplier: -0.5},
    rightLeg: {width: 4, height: 12, length: 4, x: -2, y: 12, z: 0, baseUnit: "20px", wrapSize: "0px", swingCenterY: -6, canSwing: true, swingDelayMultiplier: 0},
    headOuter: {width: 8, height: 8, length: 8, x: 0, y: -10, z: 0, baseUnit: "20px", wrapSize: "12px"},
    torsoOuter: {width: 4, height: 12, length: 8, x: 0, y: 0, z: 0, baseUnit: "20px", wrapSize: "12px"},
    leftArmOuter: {width: 4, height: 12, length: 4, x: 6, y: 0, z: 0, baseUnit: "20px", wrapSize: "12px", swingCenterY: -6, canSwing: true, swingDelayMultiplier: 0},
    rightArmOuter: {width: 4, height: 12, length: 4, x: -6, y: 0, z: 0, baseUnit: "20px", wrapSize: "12px", swingCenterY: -6, canSwing: true, swingDelayMultiplier: -0.5},
    leftLegOuter: {width: 4, height: 12, length: 4, x: 2, y: 12, z: 0, baseUnit: "20px", wrapSize: "12px", swingCenterY: -6, canSwing: true, swingDelayMultiplier: -0.5},
    rightLegOuter: {width: 4, height: 12, length: 4, x: -2, y: 12, z: 0, baseUnit: "20px", wrapSize: "12px", swingCenterY: -6, canSwing: true, swingDelayMultiplier: 0},
};

