// 隱私說明（TASK-21）：內容與 repo 的 docs/privacy.md 一致（PrivacyScreen.test.tsx 比對）
import { t } from '../../i18n/t'
import { SubScreen } from '../../shell/Screen'
import { Card, cardTitleCls } from '../../ui/Card'
import { PRIVACY_ITEMS } from './privacyItems'

export function PrivacyScreen() {
  return (
    <SubScreen title={t('privacy.page.title')}>
      <div data-testid="screen-privacy" className="contents">
        <p className="rounded-control bg-hint-bg px-3.5 py-2.5 text-secondary text-hint">
          {t('privacy.page.disclaimer')}
        </p>
        {PRIVACY_ITEMS.map((id) => (
          <Card key={id} tight>
            <h2 className={`${cardTitleCls} break-words`}>{t(`privacy.${id}.title`)}</h2>
            <p className="text-secondary break-words">{t(`privacy.${id}.body`)}</p>
          </Card>
        ))}
      </div>
    </SubScreen>
  )
}
