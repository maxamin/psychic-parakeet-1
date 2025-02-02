export const VerificationStatus: string[] = [
    "En attente d'approbation",
    "Validée par le vérificateur",
    "Approuvée",
    "Rejetée",
    "Approuvée sous réserve",
]

export const RegisterVerificationId: string[] = [
        'Aération - installation de ventilation',
        'Équipement sous pression',
        'Ascenseurs, monte-charges',
        'Bruit',
        'Éclairage',
        'Électricité',
        'Incendie',
        'Installations frigorifiques',
        'installations thermiques',
        'Portes et portails',
        'Rayonnements ionisants',
        'Rayonnements optiques',
        'Rayonnements chimiques',
        'Signalisation',
        'Systèmes de climatisation et pompte à chaleur réversible'
]

export const UpdateTaskStatus: string[] = [
    'WaitForApproval',
    'ValidatedByVerifier',
    'approve',
    'reject',
    'approveWithReservation',
]

export interface ITaskStatusEditAction {
    id: number
    action: string
}

export interface ITaskStatusFinalStatus extends ITaskStatusEditAction {}

export const VALID_TASK_STATUS_FOR_MINTING_NFT = ['approve', 'reject']
export const VALID_TASK_STATUS_ID_FOR_MINTING_NFT = [2, 3]
export const IPFS_URL: string = "https://ipfs.io/ipfs/"
export const IPFS_METADATA_PREFIX: string = "security-register-taskId-"