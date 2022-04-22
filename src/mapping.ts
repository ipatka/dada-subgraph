import { Address, BigInt } from '@graphprotocol/graph-ts'
import { CollectibleTransfer, CollectibleBought, DadaCollectible } from '../generated/DadaCollectible/DadaCollectible'
import { CollectiblesOwnership, Transfer } from '../generated/CollectiblesOwnership/CollectiblesOwnership'
import {
    Wrapped2017,
    Wrapped2019,
    Unwrapped2017,
    Unwrapped2019,
    Transfer as WrappedTransfer,
    DadaCollectibleWrapper,
} from '../generated/DadaCollectibleWrapper/DadaCollectibleWrapper'
import { Collectible, Collector } from '../generated/schema'

const wrapperAddr = '0x5F53f9f5DcF76757f7CbF35C2e47164C65b9b5eD'
const nftAddr = '0x34d77a17038491A2a9Eaa6E690B7C7CD39FC8392'
const zeroAddress = '0x0000000000000000000000000000000000000000'

    const PREFIX_2017 = BigInt.fromString('20170000000000')
    const PREFIX_2019 = BigInt.fromString('20190000000000')
    const DRAWING_ASSET_ID_MUL = BigInt.fromString('100000')
    
    function get2017TokenId(drawingId: BigInt, printIndex: BigInt): string {
      return PREFIX_2017.plus(drawingId.times(DRAWING_ASSET_ID_MUL)).plus(printIndex).toString()
    }

    function get2019TokenId(tokenId: BigInt, tokenNumber: BigInt): string {
      return PREFIX_2019.plus(tokenId.times(DRAWING_ASSET_ID_MUL)).plus(tokenNumber).toString()
    }

export function handle2017CollectibleBought(event: CollectibleBought): void {
    // Entities can be loaded from the store using a string ID; this ID
    // needs to be unique across all entities of the same type
    let collector = Collector.load(event.params.toAddress.toHexString())

    const collectibleId = get2017TokenId(event.params.collectibleIndex, event.params.printIndex)
    let collectible = Collectible.load(collectibleId)

    // Entities only exist after they have been saved to the store;
    // `null` checks allow to create entities on demand
    if (!collector) {
        collector = new Collector(event.params.toAddress.toHexString())
    }

    if (!collectible) {
        collectible = new Collectible(collectibleId)
        collectible.state = 'Unwrapped'
    }

    collectible.owner = collector.id

    collectible.save()
    collector.save()
}

export function handle2017CollectibleTransfer(event: CollectibleTransfer): void {
    // Entities can be loaded from the store using a string ID; this ID
    // needs to be unique across all entities of the same type
    let collector = Collector.load(event.params.to.toHexString())

    const collectibleId = get2017TokenId(event.params.collectibleIndex, event.params.printIndex)
    let collectible = Collectible.load(collectibleId)

    // Entities only exist after they have been saved to the store;
    // `null` checks allow to create entities on demand
    if (!collector) {
        collector = new Collector(event.params.to.toHexString())
    }

    if (!collectible) {
        collectible = new Collectible(collectibleId)
        collectible.state = 'Unwrapped'
    }

    collectible.owner = collector.id

    collectible.save()
    collector.save()
}

export function handle2019CollectibleTransfer(event: Transfer): void {
    let nft = CollectiblesOwnership.bind(Address.fromString(nftAddr))
    // Entities can be loaded from the store using a string ID; this ID
    // needs to be unique across all entities of the same type
    let collector = Collector.load(event.params.to.toHexString())

    const info = nft.collectibleInfo(event.params.tokenId)

    const collectibleId = get2019TokenId(info.value0, event.params.tokenId)
    let collectible = Collectible.load(collectibleId)

    // Entities only exist after they have been saved to the store;
    // `null` checks allow to create entities on demand
    if (!collector) {
        collector = new Collector(event.params.to.toHexString())
    }

    if (!collectible) {
        collectible = new Collectible(collectibleId)
        collectible.state = 'Unwrapped'
    }

    collectible.owner = collector.id

    collectible.save()
    collector.save()
}

export function handleWrap2017(event: Wrapped2017): void {
    let wrapper = DadaCollectibleWrapper.bind(Address.fromString(wrapperAddr))

    let collectible = Collectible.load(event.params._wrappedTokenId.toString())

    // Should be impossible
    if (!collectible) {
        collectible = new Collectible(event.params._wrappedTokenId.toString())
        const owner = wrapper.ownerOf(event.params._wrappedTokenId)
        let collector = Collector.load(owner.toHexString())
        if (!collector) {
            collector = new Collector(owner.toHexString())
            collector.save()
        }
        collectible.owner = collector.id
    }
    collectible.state = 'Wrapped'
    collectible.save()
}

export function handleUnwrap2017(event: Unwrapped2017): void {
    let collectible = Collectible.load(event.params._wrappedTokenId.toString())

    // Should be impossible
    if (!collectible) {
        collectible = new Collectible(event.params._wrappedTokenId.toString())
        let collector = Collector.load(event.transaction.from.toHexString())
        if (!collector) {
            collector = new Collector(event.transaction.from.toHexString())
            collector.save()
        }
        collectible.owner = collector.id
    }
    collectible.state = 'Unwrapped'
    collectible.save()
}

export function handleWrap2019(event: Wrapped2019): void {
    let wrapper = DadaCollectibleWrapper.bind(Address.fromString(wrapperAddr))

    let collectible = Collectible.load(event.params._wrappedTokenId.toString())

    // Should be impossible
    if (!collectible) {
        collectible = new Collectible(event.params._wrappedTokenId.toString())
        const owner = wrapper.ownerOf(event.params._wrappedTokenId)
        let collector = Collector.load(owner.toHexString())
        if (!collector) {
            collector = new Collector(owner.toHexString())
            collector.save()
        }
        collectible.owner = collector.id
    }
    collectible.state = 'Wrapped'
    collectible.save()
}

export function handleUnwrap2019(event: Unwrapped2019): void {
    let collectible = Collectible.load(event.params._wrappedTokenId.toString())

    // Should be impossible
    if (!collectible) {
        collectible = new Collectible(event.params._wrappedTokenId.toString())
        let collector = Collector.load(event.transaction.from.toHexString())
        if (!collector) {
            collector = new Collector(event.transaction.from.toHexString())
            collector.save()
        }
        collectible.owner = collector.id
    }
    collectible.state = 'Unwrapped'
    collectible.save()
}

export function handleWrappedTransfer(event: WrappedTransfer): void {
    let collectible = Collectible.load(event.params.tokenId.toString())

    // Ignore if mint & burn because covered by other handlers
    if (event.params.to == Address.fromString(zeroAddress) || event.params.to == Address.fromString(zeroAddress)) {
        return
    }

    let collector = Collector.load(event.params.to.toHexString())
    if (!collector) {
        collector = new Collector(event.params.to.toHexString())
    }

    // Should be impossible
    if (!collectible) {
        collectible = new Collectible(event.params.tokenId.toString())
        collectible.state = 'Wrapped'
    }

    collectible.owner = collector.id
    collectible.save()
    collector.save()
}
