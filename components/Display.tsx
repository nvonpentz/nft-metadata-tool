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
        {tokenUri}
      </div>
      <div className={styles.column}>
        {metadataJson}
      </div>
      <div className={`${styles.column} ${styles.image}`}>
        <img src={imageUri} ></img>
      </div>
    </div>
  );
}

export default Display;
