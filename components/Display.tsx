import styles from '../styles/Home.module.css'

interface Props {
  tokenUri: string;
  metadataJson: string;
  imageUri: string;
}

const Display = ({ tokenUri, metadataJson, imageUri }: Props) => {
  return (
    <div className={styles.columns}>
      <div className={styles.column}>
        <div className={styles.label}>Token URI</div>
        {tokenUri}
      </div>
      <div className={styles.column}>
        <div className={styles.label}>Metadata JSON</div>
        {metadataJson}
      </div>
      <div className={`${styles.column} ${styles.image}`}>
        <div className={styles.label}>Image</div>
        <img src={imageUri} ></img>
      </div>
    </div>
  );
}

export default Display;
