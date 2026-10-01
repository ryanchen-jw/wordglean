// 尚未開放的目的地（小課、複習、分級測驗、授權頁）：TASK-17／18／21 接上前的暫時頁
import { t } from '../i18n/t'
import { navigate } from '../router'
import { SubScreen } from '../shell/Screen'
import { Button } from '../ui/Button'

export function StubScreen() {
  return (
    <SubScreen title={t('stub.page.title')}>
      <div data-testid="screen-stub" className="grid gap-4 py-6">
        <p className="text-body text-muted">{t('stub.page.body')}</p>
        <Button onClick={() => navigate('/', { replace: true })}>{t('stub.page.backHome')}</Button>
      </div>
    </SubScreen>
  )
}
