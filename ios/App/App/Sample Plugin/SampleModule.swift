import Foundation
import UIKit

enum SampleAction {
    case create, update, delete
}

struct SampleModel {
    let id: String?
    let title: String
}

protocol SampleModuleDelegate: AnyObject {

    func createSampleModel(sampleModel: SampleModel)

    func updateSampleModel(sampleModel: SampleModel)

    func deleteSampleModel(sampleModel: SampleModel)
}

final class SampleModule {

    weak var delegate: SampleModuleDelegate?

    let viewController: SampleViewController

    init() {
        viewController = SampleViewController()
        viewController.delegate = self
    }

    func receiveModels(models: [SampleModel]) {
        viewController.models = models
    }
}

extension SampleModule: SampleViewControllerDelegate {

    func didReceiveAction(_ action: SampleAction, model: SampleModel) {
        switch action {
        case .create:
            delegate?.createSampleModel(sampleModel: model)
            
        case .update:
            delegate?.updateSampleModel(sampleModel: model)
            
        case .delete:
            delegate?.deleteSampleModel(sampleModel: model)
        }
    }
}
