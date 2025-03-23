import styles from './dashboard.module.css';

export const metadata = {
  title: 'Admin Dashboard',
};

export default function Dashboard() {
  return (
    <div className={styles.dashboard}>
      <h1 className={styles.title}>Welcome to your dashboard, eTutoring</h1>

      {/* Cards thống kê */}
      <div className={styles.cards}>
        <div className={styles.card}>
          <h2 className={styles.cardNumber}>472</h2>
          <p className={styles.cardLabel}>Student</p>
          <button className={styles.cardButton}>More ➔</button>
        </div>
        <div className={styles.card}>
          <h2 className={styles.cardNumber}>472</h2>
          <p className={styles.cardLabel}>Tutor</p>
          <button className={styles.cardButton}>More ➔</button>
        </div>
        <div className={styles.card}>
          <h2 className={styles.cardNumber}>472</h2>
          <p className={styles.cardLabel}>Message</p>
          <button className={styles.cardButton}>More ➔</button>
        </div>
        <div className={styles.card}>
          <h2 className={styles.cardNumber}>472</h2>
          <p className={styles.cardLabel}>Meeting schedule for the week</p>
          <button className={styles.cardButton}>More ➔</button>
        </div>
      </div>

      {/* Khối "Add" */}
      <div className={styles.addBlocks}>
        <div className={styles.addBlock}>
          <span className={styles.addIcon}>👤</span>
          <div>
            <h3 className={styles.addTitle}>Add other admins</h3>
            <p className={styles.addDescription}>
              Create rich course content and coaching products for your students. When you give them a pricing plan, they'll appear on your site!
            </p>
          </div>
        </div>
        <div className={styles.addBlock}>
          <span className={styles.addIcon}>🏫</span>
          <div>
            <h3 className={styles.addTitle}>Add classes</h3>
            <p className={styles.addDescription}>
              Create rich course content and coaching products for your students. When you give them a pricing plan, they'll appear on your site!
            </p>
          </div>
        </div>
        <div className={styles.addBlock}>
          <span className={styles.addIcon}>🎓</span>
          <div>
            <h3 className={styles.addTitle}>Add students</h3>
            <p className={styles.addDescription}>
              Create rich course content and coaching products for your students. When you give them a pricing plan, they'll appear on your site!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}