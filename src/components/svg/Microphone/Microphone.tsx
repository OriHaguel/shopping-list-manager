import styles from './Microphone.module.scss';

export function Microphone({ color }: { color?: string }) {
    return (
        <svg width="20px" height="20px" viewBox="0 0 32 32" enableBackground="new 0 0 32 32" id="Stock_cut" version="1.1" xmlns="http://www.w3.org/2000/svg" className={styles.microphoneIcon}>

            <desc />

            <g>

                <path d="M16,1L16,1   c-2.761,0-5,2.239-5,5v8c0,2.761,2.239,5,5,5h0c2.761,0,5-2.239,5-5V6C21,3.239,18.761,1,16,1z" fill={`${color}`} stroke={`${color}`} strokeLinejoin="round" strokeMiterlimit="10" strokeWidth="2" />

                <path d="M7,12v2   c0,4.971,4.029,9,9,9h0c4.971,0,9-4.029,9-9v-2" fill="none" stroke={`${color}`} strokeLinejoin="round" strokeMiterlimit="10" strokeWidth="2" />

                <line fill="none" stroke={`${color}`} strokeLinejoin="round" strokeMiterlimit="10" strokeWidth="2" x1="16" x2="16" y1="23" y2="32" />

            </g>

        </svg>
    );
}
