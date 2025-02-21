import { vi } from 'vitest'

import { AggregateRoot } from '@core/domain/aggregate-root'
import { UniqueEntityID } from '@core/domain/unique-entity-id'

import { DomainEvent } from './domain-event'
import { DomainEvents } from './domain-events'

// Evento de teste
class CustomAggregateCreated implements DomainEvent {
  public occurredAt: Date // Data em que o evento ocorreu
  private aggregate: CustomAggregate // Entidade que disparou o evento

  constructor(aggregate: CustomAggregate) {
    this.aggregate = aggregate
    this.occurredAt = new Date()
  }

  public getAggregateId(): UniqueEntityID {
    return this.aggregate.id
  }
}

// Entidade de teste
class CustomAggregate extends AggregateRoot<null> {
  static create() {
    const aggregate = new CustomAggregate(null)

    aggregate.addDomainEvent(new CustomAggregateCreated(aggregate))

    return aggregate
  }
}

describe('domain events', () => {
  it('should be able to dispatch and listen to events', async () => {
    const callbackSpy = vi.fn()

    // Subscriber cadastrado (ouvindo o evento de "CustomAggregateCreated")
    // Como primeiro parâmetro, passamos a função que será executada quando o evento for disparado, e como segundo parâmetro, passamos o nome do evento que queremos ouvir. Como estamos ouvindo o evento de "CustomAggregateCreated", passamos o nome da classe como parâmetro, e podemos acessar o nome da classe através da propriedade "name" da classe.
    DomainEvents.register(callbackSpy, CustomAggregateCreated.name)

    // Estou criando uma instância da entidade, pois será nela que o evento será disparado, porém SEM salvar no banco
    const aggregate = CustomAggregate.create()

    // Estou assegurando que o evento foi criado porém NÃO foi disparado
    expect(aggregate.domainEvents).toHaveLength(1)

    // No momento em que salvamos a entidade no banco, podemos disparar o evento. Onde execurará a função que foi passada como parâmetro no "DomainEvents.register"
    DomainEvents.dispatchEventsForAggregate(aggregate.id)

    // O subscriber ouve o evento e faz o que precisa ser feito com o dado. Aqui estamos testando se a função foi executada
    expect(callbackSpy).toHaveBeenCalled()

    // Estou assegurando que o evento foi disparado e que não existe mais nenhum evento na entidade
    expect(aggregate.domainEvents).toHaveLength(0)
  })
})
